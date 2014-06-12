
Template.editLLMD.helpers({
  getRoot: function(){
    console.log(this.root);
    return {atom:this.root, parents:[]};
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


