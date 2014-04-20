var fs = Npm.require('fs');

// [TODO] - set global settings file
var path = "/Users/mhhf/llWd/";


var build = function( project, cb ){

  var language = project.language || 'en';

  // Build Context
  var projectCtx = processContextFiles( path+project.hash+'/' );

  // Initialize the Parser with the context
  LlmdParser.yy.ctx = projectCtx;
  LlmdParser.yy.path = path+project.hash+'/';
  LlmdParser.yy.lang = language;
  LlmdParser.yy.llmd = new LLMD();

  // 
  // Build AST with inclusion 
  // var ast = processFile( path+project.hash+'/', 'index.lmd' );

  LLMD.preprocess({name:'include',data:'index.lmd'}, function(err, ast){
    cb(null, {
      ast: ast,
      ctx: projectCtx
    });
  });

}


var processContextFilesAsync = function( projectPath, cb ){
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
var processContextFiles = Meteor._wrapAsync( processContextFilesAsync );

LLMDBuilder = {
  build: Meteor._wrapAsync( build )
}
