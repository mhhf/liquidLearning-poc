Meteor.startup( function(){

	// Initialize the Text to speach engine
	// TODO #tts #filepicker: rename key to filepickerKey
	TtsEngine = new TTS({
		key: 'A64VCBSSpKplhCYDX8Uvwz',
		s3bucket: 'liquidlearning-poc',
		service: "tts"
	});

});


// TODO #filepicker #s3: get rid of filepicker as a transit service
// TODO #promisses #architecture: rewrite callbacks in promises
Meteor.methods({

	clear: function(){
		Syncs.remove({});
	}

});
