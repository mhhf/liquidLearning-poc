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
    template: 'editLecture',
    controller: EditCourseController,
    waitOn: function(){
      return [
        Meteor.subscribe('course', this.params._courseId),
        Meteor.subscribe('courseUnits', this.params._courseId, this.params.lecture)
      ];
    },
    data: function(){
      
      
      mediaHandler = new SyncQue();
      
      var unit = Units.findOne({ name: this.params.lecture });
      var branch = LQTags.findOne({ _id: unit.branch._id });
      var commit = Commits.findOne({ _id: branch._commitId });
      var root = Atoms.findOne({ _id: commit.rootId });
      
      return {
        data: Courses.findOne(),
        section: this.params.section,
        lectureName: this.params.lecture,
        unit: unit,
        index: 0,
        mediaHandler: mediaHandler,
        root: root,
        editor: {
          edit: true
        },
        branch: branch
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
SyncLectureLoader = function( _id ){

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
  
  Meteor.call('atom.compile', _id, function(err, data){
    Session.set('ast',data);
    setReady(true);
  });
  

  retObj = {
    ready: ready
  };
  return retObj;
};
