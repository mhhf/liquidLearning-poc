EditorModel = function( o ){
  
  this.editable = !!o.editable;
  
  this.commitModel = o.commitModel;
  
  this.dep =	new Deps.Dependency,
  this.val = null,
  this.data = null,
  this.get = function( state ){
    this.dep.depend();
    if( !state || state == this.val ) {
      return this.data;
    } else {
      return null;
    }
  };
   
  this.set = function( state, data ){
    this.dep.changed();
    this.val = state;
    this.data = data;
  };
  
  this.save = function( atom, ids ){
    
    this.commitModel.change(atom, ids);
      
    this.set(null);
  };
  
  this.diffLeft = function( wrappedAtom ){
    
    var atom = wrappedAtom.atom;
    var ids = wrappedAtom.parents;
    ids.push(atom._id);
    
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
    } else if( wrappedAtom.atom.meta.diff.type == 'change' ) {
      var atom = Atoms.findOne({ _id: wrappedAtom.atom.meta.diff.atom });
    } else {
      var atom = wrappedAtom.atom;
    }
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
  
  this.add = function( name ){
    
    var atom = new LLMD.Atom( name );
    
    var wrappedAtom = this.wrapAtom( atom );
    
    wrappedAtom.parents = this.data.parents;
    wrappedAtom.parents.push( this.data.atom._id );
    
    this.set('add', wrappedAtom );
    
  };
  
  this.wrapAtom = function( atom ){
    var wrappedAtom = {
      atom: atom,
      editorModel: this
    };
    
    // if( atom.meta.state == 'init' ) {
    //   this.set( wrappedAtom );
    // }
      
    return wrappedAtom;
  };
  
}
