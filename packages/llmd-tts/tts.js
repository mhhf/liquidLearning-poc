if( Meteor.isServer ){
  var Fiber = Npm.require('fibers');
}

LLMD.registerPackage("tts", {
  init: function(){
    this.data = [];
  },
  dataFilter: function( params, rawData ){
    var data = [];
    
    // [TODO] - default language is 'en' -> settings
    var lang = ( params && ( params.length == 1 ) && params[0] ) || 'en'; 
    
    for( var block in rawData ) {
      // interpret als sentance
      if( !block.name ) data.push({
          text: rawData[block].data ,
          lang: lang
        });
    }
    
    return data;
  },
  preprocess: function( ast, cb ){
    
    if( Meteor.isClient ) {
      console.log(ast);
      cb( null, ast );
      return true;
    }
    getSyncsForNotesAsync( ast.data, function( err, syncs ){
      
      var result = _.map(syncs, function(o){
        delete o.i;
        return o;
      });
      
      ast.data = _.map(ast.data, function(n) { // each note
          // Substitude note with syncObject
          if( typeof n.text == 'string' )
          return _.find(result, function(r){ return r.text == n.text; }); 
        return n;
        }); 
      
      cb( null, ast );
    });
    
  }
});


// 
// converts an text array to a syncObject id's:
//
// 1. synthesize the text to an audio file, if neccecery
// 2. provides an array of syncObject id's from the database
//
//
// [TODO] - "sentance" and "sentance " has different hashes but same mp3url hash? - BUG!
var getSyncsForNotesAsync = function( text , cb ){
  var processed = [];
  var queue = 0;

  var t0 = +(new Date());

  var hash, tts, mp3Link;
  for(var i=0; i<text.length; i++) {
    // [TODO] - hash from text[i].toString() 
    //          current implementation could cause problems for same sentance and multiple languages/ voices
    hash = CryptoJS.SHA1( JSON.stringify( text[i] ) ).toString();          
    // hash = MD5.hash( text[i].text ).toString();
    tts = Syncs.findOne({ hash: hash });
    if(!tts){
      queue++;
      console.log("synthesize "+text[i].lang+": "+text[i].text);
      

        Fiber( function(){

          // get the synth object
          var size = -1;
          var lang = text[i].lang;
          var obj = {yo:"yay"}
          var obj = TtsEngine.synthesize({
            text : text[i].text,
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
