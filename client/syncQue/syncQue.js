// Handles the time based events during the play state

var SoundQueue = new Meteor.Collection('');


SyncQue = function( o ){

	var _startPlaying = 0; // Time when the player starts to play
	var soundQueue = 0; 
	var _soundBuffer = [];
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

	this.addEvent = function( e ){
		
	};

	////// LOADING AND BUFFERING


	// TODO #loading: build a buffer queue - its not wise to pre buffer an unknown length of sound files
	this.loadSounds = function(  o, cb ) {
			soundQueue = o.length;

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
				_soundBuffer.push({buffer:buffer, hash:ttsO.hash});
				if(--soundQueue == 0) cb(null, _soundBuffer );
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
	this.startPlay = function( buffer ){

		var time = 0, cBuffer;
		for(var i=0; i<text.length; i++) {
			cBuffer = findHash( MD5.hash( text[i] ), buffer );
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

}

