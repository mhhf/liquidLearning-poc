var soundBuffer = [];
var soundQueue = 0;


// TODO #loading: build a buffer queue - its not wise to pre buffer an unknown length of sound files
// TODO #garbageCollection: destroy played sounds after a while
// TODO #sounds: create a sound package and a play queue, handle the audio context, and an sync event queue with function callbacks
loadSounds = function( context, o, cb ) {
		soundQueue = o.length;

	_.each(o, function( ttsO ){
		var request = new XMLHttpRequest();
		request.open('GET', ttsO.link, true);
		request.responseType = 'arraybuffer';

		// Decode asynchronously
		request.onload = function(a,b) {
			context.decodeAudioData( request.response, function(buffer) {
				soundBuffer.push({buffer:buffer, hash:ttsO.hash});
				if(--soundQueue == 0) cb(null, soundBuffer );
			}, function(e,a){
					console.log(request);
			});
		}
		request.send();
	});
}



playSound = function( context, buffer, time ) {
	time || ( time = 0 );
  var source = context.createBufferSource(); // creates a sound source
  source.buffer = buffer;                    // tell the source which sound to play
  source.connect(context.destination);       // connect the source to the context's destination (the speakers)
  source.start( time );                           // play the source now
                                             // note: on older systems, may have to use deprecated noteOn(time);
}
