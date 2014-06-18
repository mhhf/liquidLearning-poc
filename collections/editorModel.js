EditorModel = function( o ){
  
  this.editable = !!o.editable;
  
  this.commitModel = o.commitModel;
  
  this.dep =	new Deps.Dependency,
  this.val = null,
  this.get = function(){
    this.dep.depend();
    return this.val;
  },
  this.set = function( val ){
    this.dep.changed();
    this.val = val;
  },
  this.save = function( atom, ids, commit ){
    
    commit.change(atom, ids);
      
    this.set(null);
  },
  this.dismiss = function(){
    this.set(null);
  },
  this.remove = function( ids, commit ){
    
    commit.remove( ids );
  }
  
  this.wrapAtom = function( atom ){
    var wrappedAtom = {
      atom: atom,
      commit: this.commitModel,
      editorModel: this
    };
    
    if( atom.meta.state == 'init' ) {
      this.set( wrappedAtom );
    }
      
    return wrappedAtom;
  }
  
}
