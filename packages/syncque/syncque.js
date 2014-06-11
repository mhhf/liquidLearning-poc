// #MediaHandler

// [TODO] - indicate dublicate buffer and dont loading it twice
SyncQue = function( o ){

	var _bufferDataDeps = new Deps.Dependency;
	var _bufferStateDeps = new Deps.Dependency;

	var _bufferPointer = null; // pointer, to the current place in the playlist
	var _currentSource; // playing audio source

	var _syncObjects = {};
  var _soundBuffersHashMap = {};
	var context;

	// GRAB Audio Context
	try {
		// Fix up for prefixing
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		context = new AudioContext();
	}
	catch(e) {
		alert('Web Audio API is not supported in this browser');
	}

	////// LOADING AND BUFFERING


	// TODO #loading: build a buffer queue - its not wise to pre buffer an unknown length of sound files
	this.initSounds = function( o, cb ) {

    var loadingCounter = o.length;

		_.each(o, function( ttsO ){
			loadSound( ttsO, function(){
        if( --loadingCounter == 0 ) cb()
      });
		});
	}

  this.loadSound = function( ttsO, cb ){
    loadSound( ttsO, cb );
  }
  
	var loadSound = function( ttsO, cb ) {
		var request = new XMLHttpRequest();
    
    var protocoll = "";
    if( !ttsO.link.match(/^http:\/\//) ) protocoll = "http://"
    
		request.open('GET', protocoll+ttsO.link, true);
		request.responseType = 'arraybuffer';

		// Decode asynchronously
		request.onload = function(a,b) {
			context.decodeAudioData( request.response, function(buffer) {
				insertBuffer(ttsO.hash, buffer);
        cb();
				_bufferDataDeps.changed();
			}, function(e){
				console.log(request, e,a,b, ttsO.link);
			});
		}
		request.send();
	}
  
  this.playSounds = function( ttsOs, cb ){
    _bufferPointer = null;
    _syncObjects = ttsOs;
    
    playNext( cb );
    
  };
  
  this.playSound = function( hash, cb ){
    playSound( _soundBuffersHashMap[hash], 0, cb );
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

  var playNext = function(cb){
    
    var buffer;
    if( buffer = getNextBuffer() ) {
      
      playSound( buffer, 0, function(){

        // make a little break between sentances
        //
        setTimeout( function(){
          playNext(cb);
        },250);
      });

    } else {
      cb();
    }
    
    // updatePlayState();
    _bufferStateDeps.changed();
  }

	// inserts the loaded soundBuffer:ArrayBuffer at the right place in the sound
	// Queue
	var insertBuffer = function( hash, buffer ) {
    _soundBuffersHashMap[ hash ] = buffer;
    // setStatus( hash, 'loaded' );
    return true;
	}

  var updatePlayState = function(){
    // set the currentPlayed state
    // XXX: da fuck? rewrite: n -> 1
    for(var i=0; i<_syncObjects.length; i++) {
      _syncObjects[i].playing = (i == _bufferPointer);
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
  
  // Increment the bufferPointer and returns the pointed syncObject
  // if bufferPointer isn't set, starts with 0
  var getNextBuffer = function(){
    
    if(_bufferPointer === null) _bufferPointer = 0;
    else _bufferPointer++;
    
    var buffer = ( _bufferPointer in _syncObjects ) && _soundBuffersHashMap[ _syncObjects[_bufferPointer].hash ];
    
    return buffer;
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
    // console.log("pointer",_bufferPointer);
		_bufferStateDeps.depend();
    // XXX: test why sometimes this is called with _bufferPointer == -1
    return _syncObjects[_bufferPointer];
    return null;
	}
  
}

