Template.player.rendered = function(){
	// GRAB Audio Context
	try {
		// Fix up for prefixing
		window.AudioContext = window.AudioContext||window.webkitAudioContext;
		context = new AudioContext();
	}
	catch(e) {
		alert('Web Audio API is not supported in this browser');
	}

	// Handle the size of the stage
	handleResize();
	$(window).resize( function(e){
		handleResize();
	});


	loadSounds( context, Syncs.find().fetch(), function(err, buffer){
		startPlay( buffer );
	});
}


handleResize = function(){
	var ratio = 3/4;
	$('.editContainer').height( $('#stage').width() * ratio );
	$('#newSlide').height( $('#newSlide').width() * ratio );
}

snapshotCanvas = function(){
	// TODO #preview #slides: extend html2canvas to draw absolute values or write own html2canvas renderer
	html2canvas($('#stage')[0],{
		onrendered: function(canvas){
			document.body.appendChild(canvas);
		},
		useCORS: true
	});	
}

Template.player.events({
	"click button[name=stop]" : function(){
		Router.go('editor');
	}
});


// TODO #sync: Write a intervall sync cycle routine and an event queue
// TODO #sync: show transcript, while text is being read.
startPlay = function( buffer ){


	var text = Session.get('text');
	var time = 0, cBuffer;
	for(var i=0; i<text.length; i++) {
		cBuffer = findHash( MD5.hash( text[i] ), buffer );
		playSound( context, cBuffer.buffer, time );
		time += cBuffer.buffer.duration + 0.2;
	}
}


var findHash = function( hash, array ){
	for(var i=0; i< array.length; i++){
		if( array[i].hash == hash ) { return array[i]; }
	}
	return null;
}
