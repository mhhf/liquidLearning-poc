var fs = Npm.require('fs');

var path = "/Users/mhhf/llWd/";

Meteor.methods({

  // [TODO] - "sentance" and "sentance " has different hashes but same mp3url hash? - BUG!
  // Build the ast
  // maps the syncs to the ast notes
  buildProject: function( _id ){
    
    // [TODO] - check if _id isn't null
    
    // [TODO] - acl
    var project = Projects.findOne( { _id: _id } );
    var language = project.language || 'en';
    
    
    // Build AST with inclusion 
    // [TODO] - export in function
    var ast = processFile( path+project.hash+'/', 'index.md' );
    
    // Filter ast for notes and generate syncs
    var notes = [];
    
    ast.forEach( function(obj){
      if( !( obj.type == 'block' && obj.name == '???' ) ) return false;
      
      // set lanuage of the explanation block
      var lang = ( obj.opt && obj.opt[0] ) || language;
      
      obj.data.forEach( function( text ){
        notes.push({
          text: text,
          lang: lang
        });
      });
    });
    
    // Result after the sythesize process
    result = _.map(Syncer.getSyncsForNotes( notes ), function(o){
      delete o.i;
      return o;
    });
    
    
    // Substitude the string with the syncs object
    var newAst = _.map(ast, function(o){ // each slide
      if( o.type == 'block' && o.name == '???' ) o.data = _.map(o.data, function(n) { // each note
          // Substitude note with syncObject
          if( typeof n == 'string' )
            return _.find(result, function(r){ return r.text == n; }); 
          return n;
        }); 
      return o;
    });
    
    Projects.update({ _id: _id }, {$set: {
      ast: newAst,
      build: {
        date: new Date()
      },
      state: 'ready',
      changed: false
    }});
    
    return true;
  },
});

processFile = function( path, file ){
  var retAST = [];
  
  var data = fs.readFileSync( path+file , "utf8" );
  var fileAST = LlmdParser.parse( data+"\n" ); 
  
  // import files
  for (var i=0; i < fileAST.length; i++) {
    if( fileAST[i].type == 'pkg' && fileAST[i].name == 'include' ) 
    {
      // [TODO] - test if the first option is string and exists
      if( typeof fileAST[i].opt[0] == 'string' ) {
        retAST = retAST.concat( processFile( path, fileAST[i].opt[0] ) );
      } else {
        throw new Error('ERROR: file '+file+' can not be included: no such file.');
      }
    } else {
      retAST.push(fileAST[i]);
    }
  }
  
  return retAST;
}
