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
