// #SyncQue - An Time-Event Map / Audio Handler
//
// Its necessary in the player module to bind events to a time of execution
// its possible to jump between times for and backwards
// a preloader (buffer) of media data is importet to provide a fluid workflow
//
//
// Therefore the folowing questions are importent to answer:
//
//	 1. what is the best way to load, play and destroy sounds
//	 	 * what is the best way to handle a dynamic buffer
//	 2. what is the best way to track time
//	 	 * dispatch current playing sound
//	 	 * get next event
//	 	 * jump to a time position
//	 	 * ad a event at a given timeframe
var SoundQueue = new Meteor.Collection('');


SyncQue = function( o ){

	var _bufferDataDeps = new Deps.Dependency;
	var _bufferStateDeps = new Deps.Dependency;

	var _intervall; // ticker intervall
	var _startTime; // current time in the play cycle
	var _bufferPointer = -1; // pointer, to the current place in the playlist
	var _currentSource; // playing audio source

	var _startPlaying = 0; // Time when the player starts to play
	var _loadingCounter = 0; 
	var _soundBuffer;
	var _preloadQueue;
	var context;

	// GRAB Audio Context
	try {
		// Fix up for prefixing
		window.AudioContext = window.AudioContext||window.webkitAudioContext;
		context = new AudioContext();
	}
	catch(e) {
		alert('Web Audio API is not supported in this browser');
	}

	// add an event to the playline
	this.addEvent = function( e ){
		
	};

	////// LOADING AND BUFFERING


	// TODO #loading: build a buffer queue - its not wise to pre buffer an unknown length of sound files
	this.initSounds = function( o, cb ) {

		_soundBuffer = o;

		_loadingCounter = o.length;

		_.each(o, function( ttsO ){
			loadSound( ttsO, cb );
		});
	}


	var loadSound = function( ttsO, cb ) {
		var request = new XMLHttpRequest();
		request.open('GET', ttsO.link, true);
		request.responseType = 'arraybuffer';

		// Decode asynchronously
		request.onload = function(a,b) {
			context.decodeAudioData( request.response, function(buffer) {
				insertBuffer(ttsO.hash, buffer);
				_bufferDataDeps.changed();
			}, function(e,a){
				console.log(request);
			});
		}
		request.send();
	}

	// TODO #garbageCollection: destroy played sounds after a while
	var playSound = function( buffer, time, endedCallback ) {
		time || ( time = 0 );
		_currentSource = context.createBufferSource();
		_currentSource.buffer = buffer;              
		_currentSource.connect( context.destination ); 
		_currentSource.start( time );
    if( endedCallback )
      _currentSource.onended = endedCallback;
	}

	// TODO #sync: rewrite the intervall approach to the native source.currentTime playtime
	//
	//
	// start playing the sounds in the correct order
	var startPlay = function(){

    _startTime = +new Date();
    
    playNext();

    // XXX: da fuck? this should be exported to the synthesizer
		var time = 0;
		for(var i=0; i<_soundBuffer.length; i++) {
			_soundBuffer[i].t = time;
			time += _soundBuffer[i].buffer.duration * 1000 + 200;
		}
	}


  var playNext = function(){

    if( _bufferPointer + 1 in _soundBuffer ) {
      playSound( _soundBuffer[++_bufferPointer].buffer, 0, function(){

        // make a little break between sentances
        //
        setTimeout( function(){
          playNext();
        },50);
      });

      
      updatePlayState();

      _bufferStateDeps.changed();
    }

  }

	// inserts the loaded soundBuffer:ArrayBuffer at the right place in the sound
	// Queue
	var insertBuffer = function( hash, buffer ){
		
		// search for the right hash
		for(var i = 0; i<_soundBuffer.length; i++) {
			if( _soundBuffer[i].hash == hash ){
				_soundBuffer[i].buffer = buffer;
				_soundBuffer[i].loaded = true;
				return true;
			}
		}

		return false;
	}

  var updatePlayState = function(){
    // set the currentPlayed state
    // XXX: da fuck? rewrite: n -> 1
    for(var i=0; i<_soundBuffer.length; i++) {
      _soundBuffer[i].playing = i == _bufferPointer;
    }
  }
	

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////  INTERFACE
///////////////////////////////////////////////////////////////////////////////

	this.play = function(){
		startPlay();
	}
	var _pauseAt = -1;
	this.pause = function(){
    if( _currentSource ) {
      
      if( _bufferPointer > 0 ) _bufferPointer--;
      if( _currentSource ) {
        _currentSource.onended = null;
        _currentSource.stop(0);
      }
      
    }
	}
	this.stop = function(){
		if( _currentSource ) {
      _currentSource.stop(0);
      _currentSource.onended = null;
    }
    updatePlayState();
		_bufferPointer = -1;
    _bufferStateDeps.changed();

	}
	this.getContext = function(){
		return context;
	}
  // returns a BufferSource
	this.getSource = function(){
		return _currentSource;
	}
	this.getSoundQueue = function(){
		_bufferDataDeps.depend()
		return _soundBuffer;
	}

	this.getPointer = function(){
		_bufferStateDeps.depend();
		return _bufferPointer;
	};

	this.getElement = function(){
		_bufferStateDeps.depend();
    // XXX: test why sometimes this is called with _bufferPointer == -1
    if(_bufferPointer != -1)
      return _soundBuffer[_bufferPointer];
    return _soundBuffer[0];
	}
}
