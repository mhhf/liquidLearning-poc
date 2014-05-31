EditCourseController = RouteController.extend({
  
  layoutTemplate: 'sideLayout',
  
  yieldTemplates: {
    'editAside': { to: 'aside' },
    'editToolbar': { to: 'toolbar' },
    'navbar': { to: 'navbar' }
  },
                     
                     
});




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
  
  this.route('aboutCourse', {
    path:'course/:_id/about',
    controller: EditCourseController,
    waitOn: function(){
      return [
        Meteor.subscribe('course', this.params._id)
      ];
    },
    data: function(){
      return {data:Courses.findOne()};
    }
  });
  
  this.route('editCourse', {
    path:'course/:_id/edit',
    controller: EditCourseController,
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
    template: 'editLLMD',
    controller: EditCourseController,
    waitOn: function(){
      return [
        Meteor.subscribe('course', this.params._courseId),
        Meteor.subscribe('courseUnits', this.params._courseId, this.params.lecture)
      ];
    },
    onBeforeAction: function(){
      var model = 'model';
    },
    data: function(){
      
      return {
        data: Courses.findOne(),
        section: this.params.section,
        lecture: this.params.lecture,
        unit: this.params.lecture,
        astModel: UnitModel.get({ name: this.params.lecture })
        // astModel: new ASTModel( unit._id )
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
