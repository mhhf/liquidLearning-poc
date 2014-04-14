var fs = Npm.require('fs');

LLMD.registerPackage("include", {
  dataFilter: function( params ){
    return params && params[0] ;
  },
  preprocess: function( ast, cb ){
      var retAST = ast;
    
      if( typeof ast.data == 'string' ) {
        retAST = processFile( ast.data );
      } else {
        throw new Error('ERROR: file '+file+' can not be included: no such file.');
      }
    
      cb( null, retAST );
      
  }
});

processFile = function( file ){
  var retAST = [];
  
  var data = fs.readFileSync( LlmdParser.yy.path+file , "utf8" );
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
    if( LLMD.hasPreprocess( ast[i] ) ) {
      
      waitFor ++;
      retAST.push(null);
      
      // Function Wrapper to perserve the right i value
      (function(i){
      
        LLMD.preprocess(ast[i], function(err,ret){
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

