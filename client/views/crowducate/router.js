Router.map( function(){
  
  this.route('learn');
  this.route('teach', {
    waitOn: function(){
      return Meteor.subscribe('ownCourses');
    },
    data: function(){
      return {
        courses: Courses.find()
      };
    }
  });
  
  this.route( 'newCourse', {
    waitOn: function(){
      return [ Meteor.subscribe('tags'), Meteor.subscribe('images') ];
    },
    data: {
      tags: Tags.find()
    }
  });
  
});
