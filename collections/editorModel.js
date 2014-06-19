EditorModel = function( o ){
  
  this.editable = !!o.editable;
  
  this.commitModel = o.commitModel;
  
  this.dep =	new Deps.Dependency,
  this.val = null,
  this.get = function(){
    this.dep.depend();
    return this.val;
  };
  this.set = function( val ){
    this.dep.changed();
    this.val = val;
  };
  this.save = function( atom, ids ){
    
    this.commitModel.change(atom, ids);
      
    this.set(null);
  };
  
  this.diffLeft = function( wrappedAtom ){
    
    var ids = wrappedAtom.parents;
    ids.push(atom._id);
    
    var atom = wrappedAtom.atom;
    if( atom.meta.diff.type == 'add' ) {
      this.remove( ids );
      return null;
    }
    atom.meta = _.omit(atom.meta,'diff');
    atom.meta.state = 'ready';
    this.save( atom, ids );
  };
  this.diffRight = function( wrappedAtom ){
    
    var ids = wrappedAtom.parents;
    ids.push( wrappedAtom.atom._id );
    
    if( wrappedAtom.atom.meta.diff.type == 'remove' ) {
      this.remove( ids );
      return null;
    }
    var atom = wrappedAtom.atom.meta.diff.atom;
    atom.meta = _.omit(atom.meta,'diff');
    atom.meta.state = 'ready';
    this.save( atom, ids );
  };
  this.dismiss = function(){
    this.set(null);
  };
  this.remove = function( ids, commit ){
    
    this.commitModel.remove( ids );
  };
  
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
  };
  
}
