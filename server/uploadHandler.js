Meteor.startup( function(){

	// Initialize the Text to speach engine
	// TODO #tts #filepicker: rename key to filepickerKey
	TtsEngine = new TTS({
    awsId: 'AKIAIAZ7MFEB2LGSKTYQ',
    awsSecret: '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',
		s3bucket: 'liquidlearning-poc',
		service: "tts"
	});

});


// TODO #filepicker #s3: get rid of filepicker as a transit service
Meteor.methods({
	clear: function(){
		Syncs.remove({});
	}
});
