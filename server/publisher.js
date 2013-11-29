var Fiber = Npm.require('fibers');

/*
 * Convert a an array of sentances to a syncObject Array 
 * publish the collection to the client
 */
Meteor.publish('text', function( text ){
	
	// TODO #performance: why is this method called twice?

	var endResult = [],
	result = _.sortBy(genObjectSync( text ), function(o){
		return o.i;
	});
	result = _.pluck(result, 'id' );

	return Syncs.find({_id: {$in: result}});
});

// converts an text array to a syncObject id's:
//
// 1. synthesize the text to an audio file, if neccecery
// 2. provides an array of syncObject id's from the database
//
var genObjectAsync = function( text, cb ){
  var processed = [];
  var queue = 0;

  var t0 = +(new Date());

  var hash, tts, mp3Link;
  for(var i=0; i<text.length; i++) {
    hash = MD5.hash( text[i] ).toString();
    tts = Syncs.findOne({ hash: hash });
    if(!tts){
      queue++;
      

        Fiber( function(){

          // get the synth object
          var obj = TtsEngine.synthesize({
            text : text[i],
            lang : "en"
          });

          var id = Syncs.insert( obj );
          processed.push( { id:id, i:i} );
          if( --queue == 0 ) {
            cb && cb(null, processed);
            cb = null;
          }

        }).run();

			} else {
				processed.push( {id:tts._id, i:i} );
			}
		}
		if( queue == 0 ){
			cb && cb(null, processed);
		}
}
var genObjectSync = Meteor._wrapAsync(genObjectAsync);




