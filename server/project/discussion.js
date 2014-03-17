Meteor.methods({
  newProjectComment: function( o ){
    
    var post = DPosts.findOne({_id: o._id});
    
    Meteor.call('postActivity', {
      type:'comment',
      msg: 'new comment on post "'+post.title+'"',
      _id: post.ctx
    });
    
    Meteor.call('addComment', o );
  },
  newProjectDiscussion: function( o ){
    
    Meteor.call('postActivity', {
      type:'post',
      msg: 'new post: "'+o.title+'"',
      _id: o.ctx
    });
    
    Meteor.call('newDPost', o );
  }
});
