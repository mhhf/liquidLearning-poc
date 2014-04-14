var fs = Npm.require('fs');

var path = "/Users/mhhf/llWd/";

Meteor.methods({

  // [TODO] - "sentance" and "sentance " has different hashes but same mp3url hash? - BUG!
  // Build the ast
  // maps the syncs to the ast notes
  buildProject: function( _id ){
    
    if(!_id) return false;
    
    var project = Projects.findOne( { _id: _id, $or:[{public:true},{'acl._id':this.userId}] } );
    var language = project.language || 'en';
    
    
    console.log(LLMDCompiler);
    
    // Build Context
    var projectCtx = processContextFiles( path+project.hash+'/' );
    
    // Initialize the Parser with the context
    LlmdParser.yy.ctx = projectCtx;
    LlmdParser.yy.llmd = new LLMD();
    
    // Build AST with inclusion 
    var ast = processFile( path+project.hash+'/', 'index.lmd' );
    
    // var ast = mergeContext( ast, projectCtx );
    
    // 
    // Filter ast for notes and generate syncs
    var newAst = filterNotes( ast, language );
    // 
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
  
  retAST = processNestedAST(fileAST);
  
  return retAST;
}

processNestedASTASYNC = function( ast, cb ){
  var retAST = [];
  var waitFor = 0;
  var allReady = false;
  
  // import files
  for (var i=0; i < ast.length; i++) {
    if( LlmdParser.yy.llmd.hasPreprocess( ast ) ) {
      
      waitFor ++;
      retAST.push(null);
      
      // Function Wrapper to perserve the right i value
      (function(i){
      
        LlmdParser.yy.llmd.preprocess(ast[i], function(err,ret){
          // Insert at the right place
          retAST[i] = ret;
           
          // // Test if all preprocessor ready
          if( --waitFor == 0 && allReady ) {
            cb( null, _.flatten( retAST ) );
          }
        });
        
      })(i)
      
    } else {
      retAST.push(ast[i]);
    }
  }
  
  allReady = true;
  if( waitFor == 0 ) cb( null, _.flatten( retAST ) );
  
}
processNestedAST = Meteor._wrapAsync( processNestedASTASYNC );


// [TODO] - #sync export to SyncQue/ Syncs package
filterNotes = function( ast, language ) {
  var notes = [];

  ast.forEach( function(obj){
    if( !( obj.name == '???' ) ) return false;

    // set lanuage of the explanation block
    var lang = obj.lang || language;

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
    if( o.name == '???' ) o.data = _.map(o.data, function(n) { // each note
      // Substitude note with syncObject
      if( typeof n == 'string' )
      return _.find(result, function(r){ return r.text == n; }); 
    return n;
    }); 
    return o;
  });

  return newAst;
}

processContextFilesAsync = function( projectPath, cb ){
  var ctx = {};
  fs.readdir( projectPath, function(err, files){
    files.forEach( function( file ){
      
      if(file.match('\.ljs$')) {
        var data = fs.readFileSync( projectPath+file , "utf8" );
        ctx = _.extend(ctx, JSON.parse(data));
      }
        
    });
    cb(null, ctx);
  });
}
processContextFiles = Meteor._wrapAsync( processContextFilesAsync );

// mergeContext = function( ast, ctx ){
//   
// }
