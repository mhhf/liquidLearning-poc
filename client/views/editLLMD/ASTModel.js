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
