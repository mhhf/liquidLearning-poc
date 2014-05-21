Meteor.publish('ownCourses', function(){
  // return Courses.find();
  return Courses.find({ 'owner._id': this.userId });
});
