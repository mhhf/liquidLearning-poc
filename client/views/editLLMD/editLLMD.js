
Template.editLLMD.rendered = function(){
  $('.branchSelect').selectize({
  });
}

Template.editLLMD.helpers({
  getRoot: function(){
    var atom = this.editorModel.wrapAtom( this.root );
    atom.parents = [];
    return atom;
  },
  
});


Template.commentWrapper.helpers({
  postData: function(){
    if( this._id ) {
      Meteor.subscribe('Redisc.Post', this._id);
      return {post: Redisc.Posts.findOne({_id: this._id})};
    }
    return null;
  }
});


Template.diffWrapper.helpers({
  type: function(){
    return this.atom.meta.diff.type;
  }
});
