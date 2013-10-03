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
		var endResult = [],
		result = _.sortBy(genObjectSync( text ), function(o){
			return o.i;
		});

		for(var i = 0; i< result.length; i++ ){
			endResult.push(TTS.findOne({ _id: result[i].id }));
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
			tts = TTS.findOne({ hash: hash });
			if(!tts){
				queue++;
				text2tts( text[i], function(ttsId){
					processed.push( { id:ttsId, i:i} );
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

var text2tts = function( text, callback ){
	var hash = MD5.hash( text ).toString();
	// TODO #tts: change tts synthesizer to acapella
	if( true ) {
		getMP3 = getTTS;
	} else {
		getMP3 = getAcapella;
	}
	getMP3( text , function( error, info ){
		relocate( info.mp3, hash+".mp3", function( link ){
			var ttsInfo = {
				text: text,
				hash: hash,
				link: link
			};
			if(info.sync) ttsInfo.sync = info.sync;
			var id = TTS.insert( ttsInfo );
			callback( id );
		});
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


var getTTS = function( text, cb ){
	cb( null, { mp3: "http://tts-api.com/tts.mp3?q="+escape(text) } );
}

// Acapella vaas api integration
// XXX: #voice: peter22k,will22k - maybe a better voice
var getAcapella = function( text, cb ){
	HTTP.get('http://vaas.acapela-group.com/Services/Synthesizer?prot_vers=2&cl_env=PHP_APACHE_2.2.15_CENTOS&cl_vers=1-30&cl_login=EVAL_VAAS&cl_app=EVAL_2276993&cl_pwd=s15idqvi&req_type=&req_snd_id=&req_voice=heather22k&req_text='+text+'&req_vol=&req_spd=&req_vct=&req_eq1=&req_eq2=&req_eq3=&req_eq4=&req_snd_type=&req_snd_ext=&req_snd_kbps=&req_alt_snd_type=&req_alt_snd_ext=&req_alt_snd_kbps=&req_wp=ON&req_bp=&req_mp=&req_comment=&req_start_time=&req_timeout=&req_asw_type=&req_asw_as_alt_snd=&req_err_as_id3=&req_echo=&req_asw_redirect_url=',{}, function(error,r){
			var o={};_.each(r.content.split('&'), function(s){ var t = s.split('='); o[t[0]]=t[1];});
			cb(null, {mp3: o.snd_url, sync: o.wp_url});
	})
}
