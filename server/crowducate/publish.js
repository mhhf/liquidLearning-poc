Meteor.publish('ownCourses', function(){
  // return Courses.find();
  return Courses.find({ 'owner._id': this.userId });
});

Meteor.publish('course', function( _id ){
  return  Courses.find({ _id: _id });
});

Meteor.publish('courseUnits', function( _courseId, name ){
  return Units.find({ memberOf: {$in: [_courseId]}, name: name });
})

Meteor.publish('publicCourses', function(){
  return Courses.find();
});
