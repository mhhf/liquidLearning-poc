TTS = new Meteor.Collection('tts');

// TODO #filepicker #s3: get rid of filepicker as a transit service
// TODO #promisses #architecture: rewrite callbacks in promises

Meteor.methods({

	clear: function(){
		TTS.remove({});
	},

	// return the interpreted tts format to the client
	//
	// @o:  sentences []
	//
	// @return: processed [{ hash, text, mp3Link }]
	process : function( text ){
		genObjectSync = Meteor._wrapAsync(genObjectAsync);
		var result = genObjectSync( text );
		return TTS.find({ _id: {$in:result}}).fetch();
	}

});

var genObjectAsync = function( text, cb ){
		var processed = [];
		var queue = 0;

		var hash, tts, mp3Link;
		for(var i=0; i<text.length; i++) {
			hash = MD5.hash( text[i] ).toString();
			tts = TTS.findOne({ hash: hash });
			if(!tts){
				queue++;
				text2tts( text[i], function(ttsId){
					processed.push( ttsId );
					if( --queue == 0 ) {
						cb(null, processed);
					}
				});
			} else {
				processed.push( tts._id );
			}
		}
		if( queue == 0 ){
			cb(null, processed);
		}
}

var text2tts = function( text, callback ){
	var hash = MD5.hash( text ).toString();
	relocate( "http://tts-api.com/tts.mp3?q="+escape(text), hash+".mp3", function( link ){
		var id = TTS.insert({
			text: text,
			hash: hash,
			link: link
		});
		callback( id );
	});
}

// Grab remote content and moove it to S3 Bucket
// uses filepicker as transit server and service
var relocate = function( remoteUrl, filename, callback ){
	HTTP.post("https://www.filepicker.io/api/store/S3\?key\="+FILEPICKER_API_KEY+"&filename="+filename+"&access=public",
		{ params: {
				url: remoteUrl
		} },
	function(err,result){
		if(result.statusCode != 200) console.log("Relocate", remoteUrl, result.statusCode, err);
		callback("https://s3-eu-west-1.amazonaws.com/liquidlearning-poc/"+JSON.parse(result.content).key);
	});
}
