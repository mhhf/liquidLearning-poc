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

Meteor.publish('unit', function( _id ){
  
  return Units.find({ _id: _id });
});


Meteor.publish('publicCourses', function(){
  return Courses.find();
});

Meteor.publish('commit', function( _id ){
  return Commits.find({ _id: _id })
});

Meteor.publish('atom', function( _id ){
  return Atoms.find({ _id: _id });
});

var buildHistory = function( _id ){
  var history = [];
  while( _id ) {
    history.push( _id );
    var commit = Commits.findOne({ _id: _id });  
    _id = commit && commit.parent;
  }
  
  return history;
}

Meteor.publish('commitHistory', function( _commitId ){
  var commitsId = buildHistory( _commitId );
  return Commits.find({ _id: { $in: commitsId } });
});

Meteor.publish('branch', function( _unitId, name ){
  // [TODO] - unitId
  return LQTags.find({ name:name });

});
