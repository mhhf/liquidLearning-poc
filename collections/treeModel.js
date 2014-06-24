TreeModel = function( _id  ){
  
  var self = this;
  
  
  this.ast = buildTree( _id );
  
}

// [TODO] - do the wrapping in this function
var buildTree = function( _id, cb ){
  
  var a = Atoms.findOne({ _id: _id });
  
  if( LLMD.hasNested( a ) ) {
    
    LLMD.eachNested( a, function( seq ){
      
      for( var i in seq ) {
        seq[i] = buildTree( seq[i] );
      }
      
    });
    
  } else if( a.name == 'seq' ){
    a.data = _.map(a.data, function( _seqId, i ){
      return buildTree( _seqId );
    });

  }
  
  return a;
  
}
