Syncs = new Meteor.Collection('tts');

Meteor.startup( function(){

	TtsEngine = new TTS({
		key: 'A64VCBSSpKplhCYDX8Uvwz',
		s3bucket: 'liquidlearning-poc',
		service: "tts"
	});

	// TtsEngine.synthesize({
	// 	text : "привет, ты!",
	// 	lang : "ru"   
	// },function( i ){ 
	// 	console.log( i ); 
	// });
});


// TODO #filepicker #s3: get rid of filepicker as a transit service
// TODO #promisses #architecture: rewrite callbacks in promises

Meteor.methods({

	clear: function(){
		Syncs.remove({});
	},

	// return the interpreted tts format to the client
	//
	// @o:  sentences []
	//
	// @return: processed [{ hash, text, mp3Link }]
	process : function( text ){
		genObjectSync = Meteor._wrapAsync(genObjectAsync);
		var endResult = [],
		result = _.sortBy(genObjectSync( text ), function(o){
			return o.i;
		});

		for(var i = 0; i< result.length; i++ ){
			endResult.push(Syncs.findOne({ _id: result[i].id }));
		}
		return endResult;
	}

});


var genObjectAsync = function( text, cb ){
		var processed = [];
		var queue = 0;

		var hash, tts, mp3Link;
		for(var i=0; i<text.length; i++) {
			hash = MD5.hash( text[i] ).toString();
			tts = Syncs.findOne({ hash: hash });
			if(!tts){
				queue++;

				TtsEngine.synthesize({
					text : text[i],
					lang : "en"   
				},function( i ){ 
					// XXX: insert
					console.log( i ); 
				});

				// processed.push( { id:ttsId, i:i} );
				// if( --queue == 0 ) {
				// 	cb(null, processed);
				// }
			} else {
				processed.push( {id:tts._id, i:i} );
			}
		}
		if( queue == 0 ){
			cb(null, processed);
		}
}
