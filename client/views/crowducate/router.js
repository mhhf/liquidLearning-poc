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
      return [
        Meteor.subscribe('course', this.params._id),
        Meteor.subscribe('tags')
      ];
    },
    data: function(){
      return {
        data: Courses.findOne(),
        section: null,
        tags: Tags.find()
      };
    }
  });
  
  this.route('editLecture', {
    path:'course/:_courseId/edit/:section/:lecture',
    layoutTemplate: 'sideLayout',
    yieldTemplates: {
      'editAside': { to: 'aside' },
      'navbar': { to: 'navbar' }
    },
    waitOn: function(){
      return [
      Meteor.subscribe('course', this.params._courseId),
      new SyncLectureLoader('text',this.params._courseId, this.params.lecture)
      ];
    },
    data: function(){
      return {
        data: Courses.findOne(),
        section: this.params.section,
        lecture: this.params.lecture,
        file: Session.get('fileData')
      };
    }
  });
  
  this.route('editCourseSection', {
    template: 'editCourse',
    path:'course/:_courseId/edit/:section',
    layoutTemplate: 'sideLayout',
    yieldTemplates: {
      'editAside': { to: 'aside' },
      'navbar': { to: 'navbar' }
    },
    waitOn: function(){
      return [Meteor.subscribe('course', this.params._courseId)];
    },
    data: function(){
      return {
        data: Courses.findOne(),
        section: this.params.section
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




var id = null;
var retObj = null;
SyncLectureLoader = function( id, _id, filepath ){

  var readyFlag = false ;
  var readyFlagDep = new Deps.Dependency;

  var ready = function(){
    readyFlagDep.depend();
    return readyFlag;

  }
  var setReady = function( val ){
    readyFlag = val;
    readyFlagDep.changed();
  }
  // window.setReady = setReady;
  // window.getReady = ready;

  // setTimeout( function(){
  //   setReady(true);
  // },3000);
  
  Meteor.call('openLectureFile', _id, filepath, function(err, data){
    Session.set('fileData',data);
    setReady(true);
  });
  

  retObj = {
    ready: ready
  };
  return retObj;
};
