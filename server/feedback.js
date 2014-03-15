Meteor.publish('feedback', function(){
  return DPosts.find({ ctx:'feedback' });
});

Meteor.publish('feedbackPost', function(_id){
  return DPosts.find({ ctx:'feedback', _id: _id });
});
