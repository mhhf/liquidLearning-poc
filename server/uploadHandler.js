// TODO #filepicker #s3: get rid of filepicker as a transit service
//

Meteor.methods({
	upload : function( remoteUrl ){
		relocate( remoteUrl, "asd.jpg");
	},

	// return the interpreted tts format to the client
	//
	// @o:  sentences []
	//
	// @return: processed [{ hash, text, mp3Link }]
	process : function( o ){
		
	}
});


// Grab remote content and moove it to S3 Bucket
// uses filepicker as transit server and service
var relocate = function( remoteUrl, filename ){
	HTTP.post("https://www.filepicker.io/api/store/S3\?key\="+FILEPICKER_API_KEY+"&filename="+filename,
		{ params: {
				url: remoteUrl
		} },
	function(err,result){
		if(result.statusCode != 200) console.log("Relocate", remoteUrl, result.statusCode, err);
		console.log(result.content);
	});
}
