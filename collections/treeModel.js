TreeModel = function( _id  ){
  
  var self = this;
  
  
  buildTree( _id, function( err, ast ){
    self.ast = ast;
  });
  
}

var buildTree = function( _id, cb ){
  
  var a = Atoms.findOne({ _id: _id });
  
  if( LLMD.hasNested( a ) ) {
    
    LLMD.applyNested( a, buildTree, function( err, ast ){ 
      // cosole.log( err, ast ); 
      cb( null, ast );
    });
    
  } else if( a.name == 'seq' ){
    _.each(a.data, function( _seqId, i ){
      buildTree( _seqId, function(err, ast) {
        a.data[i] = ast;
      });
    });
    cb( null, a)
  } else {
    cb( null, a);
  }
  
  // wrapAtom
  
}
