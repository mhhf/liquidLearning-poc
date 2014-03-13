Deps.autorun(function () {
  var current = Router.current();

  Deps.afterFlush(function () {
    $('.content-inner').scrollTop(0);
    $(window).scrollTop(0);
  });
});

Router.configure({
  layoutTemplate: 'defaultLayout',

  notFoundTemplate: 'noFound',

  loadingTemplate: 'loading',

  yieldTemplates: { 
    'footer': { to: 'footer' },
    'navbar': { to: 'navbar' }
  }

});


Router.map(function() { 

  //////////////////////////////////////////////////////     FEEDBACK
  ///////////////////////////////////////////////////////////////////////////

  this.route('feedbackNew', {
    path: '/feedback/new'
  });

  this.route('feedbackPost', {
    path: '/feedback/list/:_id',
    data: function(){
      return Feedback.findOne({ '_id': this.params._id });
    }
  });

  this.route('feedback', {
    path: '/feedback'
  });

  //////////////////////////////////////////////////////     PROJECT
  ///////////////////////////////////////////////////////////////////////////
  
  this.route('projectNew', {
    path: '/project/new'
  });

  this.route('projectView', {
    path: '/project/:_id',
    data: function(){
      return Projects.findOne({_id:this.params._id});
    }
  });

  // this.route('projectPreview', {
  //   path: '/project/preview/:_id',
  //   data: function(){
  //     return Projects.findOne({_id:this.params._id});
  //   }
  // });

  this.route('projects', {
    path: '/projects',
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

  this.route('projectEdit', {
    path: '/project/edit/:_id',
    waitOn: function(){
      return Meteor.subscribe('userProjects');
    },
    data: function(){
      var project = Projects.findOne({_id: this.params._id });
      return project;
    },
    layoutTemplate: 'fullLayout'
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
          data: fileData
        }
      }
    },
    action: function(){
      this.render();
    }
    
  });

  this.route('projectSettings', {
    path: '/project/settings/:_id',
    data: function(){
      var project = Projects.findOne({_id: this.params._id });
      return project;
    }
  });

  this.route('projectDiscuss', {
    path: '/project/discuss/:_id',
    data: function(){
      var project = Projects.findOne({_id: this.params._id });
      return project;
    }
  });

  //////////////////////////////////////////////////////       LAYOUT
  ///////////////////////////////////////////////////////////////////////////

  this.route('login', {
    path: '/login'
  });

  this.route('signup', {
    path: '/signup'
  });

  this.route('home', {
		path: '/',
		data: function(){
			var tmpData = { syncs: Syncs.find() }
			return tmpData;
		}
	});

	this.route('editor',{
    waitOn: function(){

      return new SyncLoader('text');
    },
    action: function(){
      GAnalytics.pageview("/editor");
      
      this.render('editor');
    }
  });

  this.route('projectPreview', {

    path: '/project/preview/:_id',
    
    waitOn: function(a,b){
      return Meteor.subscribe('userProjects');
    },
    
    before: function(){
      syncQue = new SyncQue();
    },
    
    data: function(){
      var project = Projects.findOne({ _id: this.params._id });
      window.project = project;
      
      if( project ) {
       
        // inherent blockIndex number to syncs
        _.each( project.ast, function( block, blockIndex ){
          block.index = blockIndex;
          if( block.type == 'block' && block.name == '???' )
            _.map( block.data , function( note ){
              note.slideIndex = blockIndex;
              return note;
            });
        });
        var noteSlides = _.filter( project.ast, function(b){ return b.name == '???'; });
        
        // make a playList from the projectAST
        syncQue.initSounds( _.flatten(_.pluck(noteSlides,'data')) );
        
        return { 
          _id: this.params._id,
          ttsObject: Syncs.find(),
          syncQue: syncQue,
          ast: project.ast,
          syncs: project.syncs,
          project: project
        };
      }
      console.log("err");
      return null;
    },
    
    action: function(data) {
    
      // Subtitle Visuals
      // [TODO] - free from router - wait for shark rendering engine #UI
      Deps.autorun( function(){
        var ele = syncQue.getElement();
        var pointer = syncQue.getPointer();
        
        if(ele) {
          // align the top position of the subtitles
          $('.textContainer center').css('margin-top',-20*pointer+'px');
          
          // mark the current line as active
          $('.textContainer center span').removeClass('playing');
          if( pointer != -1 )
            $('.textContainer center span#text_'+pointer).addClass('playing');
          
          
          // mark the current blob as active
          $('.processWrapper li').removeClass('playing');
          $('.processWrapper li#playstate_'+ele.i).addClass('playing');
        }
        
      });
      
      this.render();
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
var fileData = fileData;
SyncLoader = function( id, _id, filepath ){
  if ( retObj ) return retObj; 

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
    fileData = data;
    setReady(true);
  });
  

  retObj = {
    ready: ready
  };
  return retObj;
};

