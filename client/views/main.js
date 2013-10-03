TTS = new Meteor.Collection('tts');
TTSSubscribtion = Meteor.subscribe("syncedTTS");

Session.set('typing',true);

Template.home.helpers({
	typing: function(){
		return Session.get('typing');	
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
};

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
		Meteor.call("process", s, function( o, a ){
			console.log(o,a);
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
