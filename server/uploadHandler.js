Syncs = new Meteor.Collection('tts');

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
				},function( obj ){ 
					var id = Syncs.insert( obj );
					processed.push( { id:id, i:i} );
					if( --queue == 0 ) {
						cb(null, processed);
					}
				});

			} else {
				processed.push( {id:tts._id, i:i} );
			}
		}
		if( queue == 0 ){
			cb(null, processed);
		}
}
