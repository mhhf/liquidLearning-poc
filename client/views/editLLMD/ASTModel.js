
ASTModel = function( selector ){
  
  var self = this;
  this.atomModels = [];
  var atomDeps = new Deps.Dependency;
  
  var unit = Units.findOne( selector );
  if( !unit ) throw new Error('wtf?');
  var _id = unit._id;
  
  
  var setupAtom = function( atomModel ){
      atomModel.onChange( function( atom, index ){
        var obj = {};
        obj['ast.'+index] = atom;
        Units.update({_id: _id}, {$set: obj});
      });
      atomModel.onRemove( function( atom, index ){
        Units.update({_id: _id}, {$pull: {'ast':atom} });
      });
      self.atomModels.push( atomModel );
  } 
  
  // init
  if( !self.ast ) {
    unit.ast.forEach( function( a, i ){
      var atomModel = new AtomModel( a, i, false );
      setupAtom( atomModel );
    });
  }
  
  $.extend(self, unit);
  
  this.getAtoms = function(){
    atomDeps.depend();
    return this.atomModels;
  }
  
  this.add = function( atom ){
    
    var index = this.ast.length;
    var atomModel = new AtomModel( atom, index, true );
    setupAtom( atomModel );
    Units.update({_id: _id},{$push: {ast: atom}});
    atomDeps.changed();
  }
  
  // changeIndex
  
}

// [TODO] - refactor editMode to editHandler 
AtomModel = function( m, index, editMode ){
  var self = this;
  
  this.atom = m;
  this.index = index;
  this.editHandler = new function(){
    this.dep =	new Deps.Dependency,
    this.val = editMode,
    this.get = function(){
      this.dep.depend();
      return this.val;
    },
    this.set = function( val ){
      this.dep.changed();
      this.val = val;
    },
    this.save = function(){
      var atom = self.buildAtom();
      self.atom = atom;
      self._onChange( atom, self.index );
      this.set(false);
    },
    this.dismiss = function(){
      this.set(false);
    },
    this.remove = function(){
      self._onRemove( self.atom, self.index );
    }
  };
  
  this._onChange = null;
  this.onChange = function( f ){
    this._onChange = f;
  }
  
  this._onRemove = null;
  this.onRemove = function( f ){
    this._onRemove = f;
  }
  
  
  
}
