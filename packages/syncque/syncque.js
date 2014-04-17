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
//	 	 

// [TODO] - indicate dublicate buffer and dont loading it twice
SyncQue = function( o ){

	var _bufferDataDeps = new Deps.Dependency;
	var _bufferStateDeps = new Deps.Dependency;

	var _intervall; // ticker intervall
	var _startTime; // current time in the play cycle
	var _bufferPointer = -1; // pointer, to the current place in the playlist
	var _currentSource; // playing audio source

	var _startPlaying = 0; // Time when the player starts to play
	var _loadingCounter = 0; 
	var _syncObjects;
  var _soundBuffersHashMap;
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

		_syncObjects = o;
    _soundBuffersHashMap = {};
    
    _.each( _syncObjects, function( syncObject, index ){
      _soundBuffersHashMap[ syncObject.hash ] = null;
      syncObject.i = index;
    });

		_loadingCounter = Object.keys(_soundBuffersHashMap).length;

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
			}, function(e){
				console.log(request, e,a,b, ttsO.link);
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
		for(var i=0; i<_syncObjects.length; i++) {
			_syncObjects[i].t = time;
			time += getBuffer(i).duration * 1000 + 200;
		}
	}


  var playNext = function(){

    if( _bufferPointer + 1 in _syncObjects ) {
      playSound( getNextBuffer(), 0, function(){

        // make a little break between sentances
        //
        setTimeout( function(){
          playNext();
        },250);
      });

      
      updatePlayState();

      _bufferStateDeps.changed();
    }

  }

	// inserts the loaded soundBuffer:ArrayBuffer at the right place in the sound
	// Queue
	var insertBuffer = function( hash, buffer ) {
    _soundBuffersHashMap[ hash ] = buffer;
    setStatus( hash, 'loaded' );
    return true;
	}

  var updatePlayState = function(){
    // set the currentPlayed state
    // XXX: da fuck? rewrite: n -> 1
    for(var i=0; i<_syncObjects.length; i++) {
      _syncObjects[i].playing = i == _bufferPointer;
    }
  }
  
  var setStatus = function( hash, status ){
    
    for(var i = 0; i<_syncObjects.length; i++) {
      if( _syncObjects[i].hash == hash ){
        switch ( status ) {
          case 'loading':
            
            break;
          case 'loaded': 
            _syncObjects[i].loaded = true;
            break;
        }
      }
    }
    return true;
  }
  
  var getNextBuffer = function(){
    return _soundBuffersHashMap[ _syncObjects[++_bufferPointer].hash ];
  }
  
  var getBuffer = function( i ){
    return _soundBuffersHashMap[ _syncObjects[i].hash ];
  }
	

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////  INTERFACE
///////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////       Play
  ///////////////////////////////////////////////////////////////////////////
	this.play = function(){
		startPlay();
	}
  //////////////////////////////////////////////////////       Pause
  ///////////////////////////////////////////////////////////////////////////
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
  //////////////////////////////////////////////////////       Stop
  ///////////////////////////////////////////////////////////////////////////
	this.stop = function(){
		if( _currentSource 
        && _currentSource.playbackState == _currentSource.PLAYING_STATE 
    ) {
      _currentSource.stop(0);
      _currentSource.onended = null;
    }
    updatePlayState();
		_bufferPointer = -1;
    _bufferStateDeps.changed();

	}
  //////////////////////////////////////////////////////       getContext
  ///////////////////////////////////////////////////////////////////////////
	this.getContext = function(){
		return context;
	}
  //////////////////////////////////////////////////////       getSource
  ///////////////////////////////////////////////////////////////////////////
  // returns a BufferSource
	this.getSource = function(){
		return _currentSource;
	}
  //////////////////////////////////////////////////////       detSoundQueue
  ///////////////////////////////////////////////////////////////////////////
	this.getSoundQueue = function(){
		_bufferDataDeps.depend()
		return _syncObjects;
	}

  //////////////////////////////////////////////////////       getPointer
  ///////////////////////////////////////////////////////////////////////////
	this.getPointer = function(){
		_bufferStateDeps.depend();
		return _bufferPointer;
	};

  //////////////////////////////////////////////////////       getElement
  ///////////////////////////////////////////////////////////////////////////
	this.getElement = function(){
		_bufferStateDeps.depend();
    // XXX: test why sometimes this is called with _bufferPointer == -1
    if(_bufferPointer != -1)
      return _syncObjects[_bufferPointer];
    if(0 in _syncObjects) return _syncObjects[0];
	}
  
}

