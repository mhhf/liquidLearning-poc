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
	var _bufferPointer = 0; // pointer, to the current place in the playlist

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
	this.initSounds = function(  o, cb ) {

		_soundBuffer = o;

		_loadingCounter = o.length;

		_.each(o, function( ttsO ){
			loadSound( ttsO, cb );
		});
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
		return _soundBuffer[_bufferPointer];
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
	var playSound = function(  buffer, time ) {
		// console.log('play');
		time || ( time = 0 );
		var source = context.createBufferSource(); // creates a sound source
		source.buffer = buffer;                    // tell the source which sound to play
		source.connect( context.destination );       // connect the source to the context's destination (the speakers)
		source.start( time );                          // play the source now
	}

	// TODO #sync: Write a intervall sync cycle routine and an event queue
	// TODO #sync: show transcript, while text is being read.
	//
	//
	// start playing the sounds in the correct order
	this.startPlay = function(){

		_startTime = +new Date();
		_bufferPointer = -1;
		_intervall = setInterval( function(){
			console.log('.');
			if( _bufferPointer + 1 in _soundBuffer ) {
				if(+new Date() - _startTime > _soundBuffer[ _bufferPointer + 1 ].t){
					playSound(_soundBuffer[++_bufferPointer].buffer, 0);
					// set the currentPlayed state
					for(var i=0; i<_soundBuffer.length; i++) {
						_soundBuffer[i].playing = i == _bufferPointer;
					}
					_bufferStateDeps.changed();
				}
			} else {
				clearInterval( _intervall );
			}
				
		},10);

		var time = 0;
		for(var i=0; i<_soundBuffer.length; i++) {
			_soundBuffer[i].t = time;
			time += _soundBuffer[i].buffer.duration * 1000 + 200;
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
	
}


