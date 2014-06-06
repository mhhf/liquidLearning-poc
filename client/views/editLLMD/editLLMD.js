
Template.editLLMD.helpers({
  getRoot: function(){
    var commit = Commits.findOne({ _id: this.unit.commitId });
    var root = Atoms.findOne({ _id: commit.rootId });
    return root;
  },
  
});


Template.llmd_seq_edit.rendered = function(){
  new Sortable(this.find('#editorContainer'), {
    handle: '.sort-handle',
    onUpdate: function(e,a){
      var oldPos = e.srcElement.dataset.index;
      var newPos = e.srcElement.previousElementSibling && e.srcElement.previousElementSibling.dataset.index - 1 || 0;
      var parent = e.srcElement.parentElement;
      console.log(e);
    }
  });
}

Template.commentWrapper.helpers({
  postData: function(){
    if( this._id ) {
      Meteor.subscribe('Redisc.Post', this._id);
      return {post: Redisc.Posts.findOne({_id: this._id})};
    }
    return null;
  }
});

Template.llmd_seq_edit.helpers({
  getData: function( ctx ){
    return {
      atom: this,
      index: ctx.data.indexOf(this),
      seqId: ctx._id 
    }
  },
  isComment: function(){
    return this.name === 'comment';
  },
  atoms: function(){
    var atoms = _.map( this.data, function(_id,a){
      var atom = Atoms.findOne({_id: _id});
      atom.parent = this._id;
      return atom;
    });
    return atoms;
  }
})
