Meteor.publish('ownLectures', function(){
  return Lectures.find({ 'owner._id': this.userId });
});
