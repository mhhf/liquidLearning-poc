
Template.editLLMD.helpers({
  getRoot: function(){
    var commit = Commits.findOne({ _id: this.unit.commitId });
    var root = Atoms.findOne({ _id: commit.rootId });
    return {atom:root, parents:[]};
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


