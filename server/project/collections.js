Meteor.publish( 'discussionPost' ,function( _id ){
  return DPosts.find({_id:_id});
});


Meteor.publish('projectDiscussion' ,function( _id ){
  return DPosts.find({ ctx:_id });
});
