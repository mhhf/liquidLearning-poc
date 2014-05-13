Meteor.publish('feedback', function(){
  return Posts.find({ tags:{$in:['feedback']} });
});

Meteor.publish('feedbackPost', function(_id){
  return Posts.find({ _id: _id });
});

Meteor.publish('dev', function(){
  return Posts.find({ tags:{$in:['dev']} });
});

Meteor.publish('devPost', function(_id){
  return Posts.find({ _id: _id });
});
