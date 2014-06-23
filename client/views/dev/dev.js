Template.devNew.events = {
  "click .save-btn": function(e,t){
    var atom = _.extend(new LLMD.Atom('redisc'), this.buildAtom() );
    var _atomId = Atoms.insert(atom);
    Router.go('devPost', {
      _id: _atomId
    });
  }
}

var edit = {
  dep:	new Deps.Dependency,
  val: null,
  get: function(){
    this.dep.depend();
    return this.val;
  },
  set: function( val ){
    this.dep.changed();
    this.val = val;
  }
}

var comment = {
  dep:	new Deps.Dependency,
  val: null,
  get: function(){
    this.dep.depend();
    return this.val;
  },
  set: function( val ){
    this.dep.changed();
    this.val = val;
  }
}

Template.devPost.helpers({
  isEdit: function(){
    return edit.get();
  },
});

Template.PostWrapper.events = {
  "click .btn-edit": function(){
    edit.set(this);
  },
  "click .btn-comment": function(){
    comment.set(this);
  }
}

Template.PostWrapper.helpers({
  isComment: function(){
    console.log(this,comment.get());
    return comment.get();
  },
  newCommentAtom: function(){
    var atom = new LLMD.Atom('redisc');
    // [TODO] - refactor _atomId to _seedId
    atom.root = this.atom.root != ''? this.atom.root : this.atom._seedId;
    atom.parent = this.atom._seedId;
    return {
      atom: atom,
      parents: [this.atom._id]
    };
  }
});

Template.EditorWrapper.events = {
  "click .cancel-btn": function(){
    edit.set(null);
    comment.set(null);
  },
  "click .save-btn": function(){
    var atom = _.extend( this.atom, this.buildAtom() );
    if( atom._id ) {
      Atoms.update({_id: atom._id}, {$set: _.omit( atom, '_id' )});
    } else {
      console.log(this.parents);
      var _id = Atoms.insert( atom );
      // Atoms.update( { _id: this.parents.pop() }, { $push: { nested } } );
      // bind the atom to the parent as nested children
      var _parentId = this.parents.pop();
      console.log(_parentId);
      var parentAtom = Atoms.findOne({ _id: _parentId });
      console.log(parentAtom);
      
      Atoms.update({ _id: parentAtom.nested }, {$push: { data: _id }});
    }
    edit.set(null);
    comment.set(null);
  }
}
