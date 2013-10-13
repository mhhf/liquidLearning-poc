Session.set('typing',true);
Session.set('tts', null);



var context, buffer;

Template.home.helpers({
	typing: function(){
		return Session.get('typing');	
	},
	loading: function(){
		return !Session.get('tts');
	},
	ttsObject: function(){
		return Session.get('tts');	
	}
});

Template.home.rendered = function(){
	$("select[name='insertText']").selectpicker({
			style: 'btn-primary', 
			menuStyle: 'dropdown-inverse'
	});
	// TODO #editor: break sentences on new lines.
	// TODO #editor: allow to insert sync informations.
	// TODO #editor: parse sentances
	// TODO #editor: add button groub for text manipulation > add sync button
	// XXX #editor: change editor to CodeMirror?
	$('#editor').wysiwyg();

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
};

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

	


Template.home.events({
	"click button[name=play]" : function(){
		Session.set('typing',false);
		var s = $('#editor')[0].innerText.replace(/\r\n|\n\r|\r|\n/g, '').split('.');
		s = _.filter(s, function(str){
			return !!str && str != "";
		});
		s = _.map(s, function(str){
			return str+'.';
		});
		Meteor.call("process", s, function( err, o ){
			Session.set('tts',o);
			loadSounds( context, o, function(err, buffer){
				startPlay( buffer );
			});
		});
		
	},
	"click button[name=stop]" : function(){
		Session.set('typing',true);
	},
	"click .select" : function(e,t){
		// TODO #textSelect: Load different texts from a database
		var val;
		switch(e.target.textContent) {
			case "none":
				val = '';
				break;
			case "LSD":
				val = 'LSD is the best known and most researched psychedelic.<br /> It is the standard against which all other psychedelics are compared.<br /> It is active at extremely low doses and is most commonly available on blotter or in liquid form.';
				break;
			default:
				val = '';
		}

	 $('#editor').html(val);
	}
});



// TODO #sync: Write a intervall sync cycle routine and an event queue
// TODO #sync: show transcript, while text is being read.
startPlay = function( buffer ){

	var tts = Session.get('tts');
	console.log(tts);
	var time = 0, cBuffer;
	for(var i=0; i<tts.length; i++) {
		cBuffer = findHash(tts[i].hash, buffer );
		playSound( context, cBuffer.buffer, time );
		time += cBuffer.buffer.duration;
	}
}

var findHash = function( hash, array ){
	for(var i=0; i< array.length; i++){
		if( array[i].hash == hash ) { return array[i]; }
	}
	return null;
}





