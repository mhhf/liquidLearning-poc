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
    onBeforeAction: function(){
      var model = 'model';
    },
    data: function(){
      
      
      mediaHandler = new SyncQue();
      
      var unit = Units.findOne({ name: this.params.lecture });
      var commit = Commits.findOne({ _id: unit.commitId });
      var root = Atoms.findOne({ _id: commit.rootId });
      
      return {
        data: Courses.findOne(),
        section: this.params.section,
        lectureName: this.params.lecture,
        unit: unit,
        index: 0,
        mediaHandler: mediaHandler,
        root: root
        // astModel: new ASTModel( unit._id )
      };
      
    }
  });
  
  this.route('commitHistory', {
    path: 'commit/:_commitId/history',
    waitOn: function(){
      return Meteor.subscribe( 'commitHistory', this.params._commitId );
    },
    data: function(){
      return {
        head: Commits.findOne({ _id: this.params._commitId })
      };
    }
  });
  
  this.route('commitView', {
    template: 'editLLMD',
    path: 'commit/:_commitId',
    waitOn: function(){
      return Meteor.subscribe( 'commit', this.params._commitId );
    },
    data: function(){
      var commit = Commits.findOne({ _id: this.params._commitId });
      return {
        head: commit,
        root: Atoms.findOne({ _id: commit.rootId })
      }
    }
  });
  
  this.route('diffCommits', {
    
    
    path: 'diff/:_diffId',
    waitOn: function(){
      // [TODO] - subscribe on atoms which are used in the diff
      
      // return [
      //   Meteor.subscribe('commit',this.params._id1),
      //   Meteor.subscribe('commit',this.params._id2)
      // ];
      // return new SyncLectureLoader( this.params._diffId );
      return Meteor.subscribe('atom',this.params._diffId);
    },
    data: function(){
      console.log( this.params._diffId );
      return {
        // ast: Session.get('ast'),
        root: Atoms.findOne({ _id: this.params._diffId }),
        index: 0
      }
      // return {
      //   commit1: Commits.findOne({ _id: this.params._id1 }),
      //   commit2: Commits.findOne({ _id: this.params._id2 })
      // }
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
