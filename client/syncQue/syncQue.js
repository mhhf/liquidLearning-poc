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

	var deps = new Deps.Dependency;

	var _startPlaying = 0; // Time when the player starts to play
	var _loadingCounter = 0; 
	var _soundBuffer;
	var _preloadQueue;
	var context;

	if(!o || !o.text) return;
	var text = o.text;

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
		console.log('initSounds');

		_soundBuffer  = o;
		// Sort sound buffer

		_loadingCounter = o.length;

		_.each(o, function( ttsO ){
			loadSound( ttsO, cb );
		});
	}

	this.getSoundQueue = function(){
		deps.depend()
		return _soundBuffer;
	}

	var loadSound = function( ttsO, cb ) {
		var request = new XMLHttpRequest();
		request.open('GET', ttsO.link, true);
		request.responseType = 'arraybuffer';

		// Decode asynchronously
		request.onload = function(a,b) {
			context.decodeAudioData( request.response, function(buffer) {
				insertBuffer(ttsO.hash, buffer);
				// _soundBuffer.push({buffer:buffer, hash:ttsO.hash});
				deps.changed();
			}, function(e,a){
				console.log(request);
			});
		}
		request.send();
	}

	// TODO #garbageCollection: destroy played sounds after a while
	var playSound = function(  buffer, time ) {
		console.log("startPlay");
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
		var time = 0, cBuffer;
		for(var i=0; i<text.length; i++) {
			cBuffer = findHash( MD5.hash( text[i] ), _soundBuffer);
			playSound(  cBuffer.buffer, time );
			time += cBuffer.buffer.duration + 0.2;
		}
	}

	// needet to solve the playback in the right order
	// TODO: rewrite to an ordered queue
	var findHash = function( hash, array ){
		for(var i=0; i< array.length; i++){
			if( array[i].hash == hash ) { return array[i]; }
		}
		return null;
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


