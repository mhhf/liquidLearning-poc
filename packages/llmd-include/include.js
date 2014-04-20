var fs = Npm.require('fs');

LLMD.registerPackage("include", {
  dataFilter: function( params ){
    console.log(params);
    return params && params[0] ;
  },
  preprocess: function( ast, cb ){
      var retAST = ast;
    
      if( typeof ast.data == 'string' ) {
        retAST = processFile( ast.data );
      } else {
        throw new Error('ERROR: file '+file+' can not be included: no such file.');
      }
      
      // console.log(retAST[0]);
      
      cb( null, retAST );
      
  }
});

LLMD.processNestedAST = Meteor._wrapAsync( LLMD.processNestedASTASYNC );

processFile = function( file ){
  var retAST = [];
  
  var data = fs.readFileSync( LlmdParser.yy.path+file , "utf8" );
  var fileAST = LlmdParser.parse( data+"\n" ); 
  console.log(data,fileAST);
  
  
  retAST = LLMD.processNestedAST(fileAST);
  
  return retAST;
}


