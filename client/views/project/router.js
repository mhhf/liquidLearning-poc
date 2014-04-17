Router.onBeforeAction('loading');

Router.map(function() {

  //////////////////////////////////////////////////////     PROJECT
  ///////////////////////////////////////////////////////////////////////////
  
  this.route('projectNew', {
    path: '/project/new'
  });

  this.route('projectView', {
    path: '/project/:_id',
    waitOn: function(){
      return Meteor.subscribe('project', this.params._id);
    },
    data: function(){
      // [TODO] - dafuck is o??
      var o = { _id: 'LyCMjLFyjg82kfAbb' };
      return _.extend(o,Projects.findOne({_id:this.params._id}));
    }
  });
  
  this.route('projectAstView', {
    path: '/project/:_id/ast',
    
    waitOn: function(){
      return Meteor.subscribe('project', this.params._id);
    },
    
    data: function(){
      return Projects.findOne({_id: this.params._id});
    }
  });

  this.route('projects', {
    path: '/projects',
    waitOn: function(){
      return [
        Meteor.subscribe('publicProjects'),
        Meteor.subscribe('userProjects')
      ];
    },
    data: function(){
      return {
        ownProjects: Projects.find({ "user._id": Meteor.userId() }, {
          sort:{'stars.length':-1,'name':1},
        }),
        popularProjects: Projects.find({"user._id": {$not: Meteor.userId()} },{
          sort:{'stars.length':-1,'name':1}, 
          limit: 20
        })
      };
    }
  });

  this.route('editFile', {
    path: '/project/:_id/edit/:path',
    waitOn: function(){
      return [
        Meteor.subscribe('project', this.params._id ),
        new SyncLoader('text',this.params._id, this.params.path)
      ];
    },
    data: function(){
      return { 
        project: Projects.findOne({_id: this.params._id}),
        file: {
          path: this.params.path,
          data: Session.get('fileData')
        }
      }
    }
  });
  
  

  this.route('projectSettings', {
    path: '/project/:_id/settings',
    waitOn: function(){
      return Meteor.subscribe('project', this.params._id );
    },
    data: function(){
      return Projects.findOne({_id: this.params._id });
    }
  });
  
  
  // [TODO] - bug!! Why does the data get called when there is no project loaded yet?
  this.route('projectPreview', {

    path: '/project/:_id/view',
    
    waitOn: function(){
      return Meteor.subscribe('project', this.params._id );
    },
    
    data: function(){
      var project = Projects.findOne({ _id: this.params._id });
      window.project = project;
      
      // [TODO] - export to syncQue
      if( project ) {
        
        mediaHandler = new SyncQue();
        var interpreter = window.interpreter = new LLMDInterpreter( project.ast, {
          mediaHandler: mediaHandler,
          context: project.ctx
        });
        interpreter.buffer(4);
        
        return { 
          interpreter: interpreter,
          _id: this.params._id,
          ttsObject: Syncs.find(),
          syncQue: mediaHandler,
          ast: project.ast,
          syncs: project.syncs,
          project: project
        };
      }
      console.log("err");
      return null;
    },
    
    unload: function(){
      syncQue.stop();
    }
  });
});
  


// TODO: factory?
// Reactive Object to pass to the waitOn function for wait on data is ready
var id = null;
var retObj = null;
SyncLoader = function( id, _id, filepath ){

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
  
  Meteor.call('openFile', _id, filepath, function(err, data){
    Session.set('fileData',data);
    setReady(true);
  });
  

  retObj = {
    ready: ready
  };
  return retObj;
};

