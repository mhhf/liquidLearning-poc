Router.map( function(){
  
  this.route('learn', {
    waitOn: function(){
      return [Meteor.subscribe('publicCourses')];
    },
    data: function(){
      return {
        courses: Courses.find()
      };
    }
  });
  
  this.route('learnCourse', {
    path: 'learn/:_id',
    waitOn: function(){
      return [Meteor.subscribe('course', this.params._id)];
    }
  });
  
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
  
  this.route('editCourse', {
    path:'course/:_id/edit',
    layoutTemplate: 'sideLayout',
    yieldTemplates: {
      'editAside': { to: 'aside' },
      'navbar': { to: 'navbar' }
    },
    waitOn: function(){
      return [Meteor.subscribe('course', this.params._id)];
    },
    data: function(){
      return {
        data: Courses.findOne()
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
