var Fiber = Npm.require('fibers');

// 
// converts an text array to a syncObject id's:
//
// 1. synthesize the text to an audio file, if neccecery
// 2. provides an array of syncObject id's from the database
//
var getSyncsForNotesAsync = function( text, lang , cb ){
  var processed = [];
  var queue = 0;

  var t0 = +(new Date());

  var hash, tts, mp3Link;
  for(var i=0; i<text.length; i++) {
    hash = MD5.hash( text[i] ).toString();
    tts = Syncs.findOne({ hash: hash });
    if(!tts){
      queue++;
      console.log("synthesize :"+text[i]);
      

        Fiber( function(){

          // get the synth object
          var size = -1;
          var obj = TtsEngine.synthesize({
            text : text[i],
            lang : lang,
            process: function( buf ){
              size = buf.length;
            }
          });
          obj['size'] = size;
          obj.lang = lang;

          var id = Syncs.insert( obj );
          
          processed.push( _.extend(obj,{_id:id, i:i}) );
          if( --queue == 0 ) {
            cb && cb(null, processed);
            cb = null;
          }

        }).run();

			} else {
				processed.push( _.extend(tts,{i:i} ) );
			}
		}
		if( queue == 0 ){
			cb && cb(null, processed);
		}
}

var getSyncsForNotes = Meteor._wrapAsync(getSyncsForNotesAsync);

Syncer = {
  getSyncsForNotes : getSyncsForNotes
};
