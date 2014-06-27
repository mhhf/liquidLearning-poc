TreeModel = function( _id  ){
  
  var modelMap = {};
  
  var self = this;
  var buildTree = function( _id, cb ){
    
    // var a = Atoms.findOne({ _id: _id });
    var a = new AtomModel( _id );
    modelMap[_id] = a;
    
    a.on('add', function( o ){
      modelMap[o.target.atom._id] = o.target;
    });
    
    if( a.isNested() ) {
      
      a.eachNested( function( seq, key ){
        
        for( var i in seq ) {
          var model = buildTree( seq[i] );
          seq[i] = model;
          
          model.on('change.hard', function( o ){
            delete modelMap[ o._oldId ];
            a.exchangeChild( key, i, this.atom._id );
            modelMap[this.atom._id] = this;
          });
          
        }
        
      });
      
    }  
    
    return a;
    
  }
  
  this.getAtomModel = function( _id ) {
    return _id in modelMap && modelMap[ _id ];
  }
  
  this.getModelMap = function(){
    return modelMap;
  }
  
  this.export = function(){
    
    var exportAtom = function( atomModel ){
      
      var atom = Atoms.findOne({ _id: atomModel.getId() } );
      
      if( atomModel.isNested() ) {
        atomModel.eachChildren( function( child, key, pos ){
          atom[key][pos] = exportAtom( child );
        });
      }
      
      return atom;
    }
    
    return exportAtom( this.root );
  }
  
  this.exportJSON = function(){
    
    var exportAtom = function( atomModel ){
      
      var atom = Atoms.findOne({ _id: atomModel.getId() } );
      
      if( atomModel.isNested() ) {
        atomModel.eachChildren( function( child, key, pos ){
          atom[key][pos] = exportAtom( child );
        });
      }
      
      return _.omit(atom,['_id','_seedId','meta']);
    }
    
    return exportAtom( this.root );
  }
  
  this.import = function( ast ){
    if( this.root ) throw new Error(' can\'t import into a full tree ');
    
    var insertAtoms = function( ast ){
      
      if( LLMD.hasNested(ast) ) {
        LLMD.eachNested(ast, function( seq, key ){
          for( var i in seq ){
            ast[key][i] = insertAtoms( ast[key][i] );
          }
        });
      }
      
      if( ast._id ) {
        return ast._id;
      } else {
        var _atomId = Atoms.insert( ast );
        return _atomId;
      }
      
      
    }
    
    this.root = buildTree( insertAtoms( ast ) );
    
    
  }
  
  
  var self = this;
  
  if( _id ) {
    this.root = buildTree( _id );
  }
  
}
 
_.extend( TreeModel.prototype, EventEmitter.prototype );
