TreeModel = function( _id  ){
  
  var modelMap = {};
  
  var self = this;
  var buildTree = function( _id, cb ){
    
    // var a = Atoms.findOne({ _id: _id });
    var a = new AtomModel( _id );
    modelMap[_id] = a;
    
    if( a.isNested() ) {
      
      a.eachNested( function( seq, key ){
        
        for( var i in seq ) {
          var model = buildTree( seq[i] );
          seq[i] = model;
          
          model.on('change.hard', function(){
            a.exchangeChild( key, i, this.atom._id );
          });
        }
        
      });
      
    }  
    
    return a;
    
  }
  
  this.getAtomModel = function( _id ) {
    return modelMap[ _id ];
  }
  
  this.getModelMap = function(){
    return modelMap;
  }
  
  
  var self = this;
  
  if( _id ) {
    this.root = buildTree( _id );
  }
  
}

_.extend( TreeModel.prototype, EventEmitter.prototype );
