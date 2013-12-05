Router.configure({
  layoutTemplate: 'defaultLayout',

  notFoundTemplate: 'noFound',

  loadingTemplate: 'loading',

  yieldTemplates: { 
    'footer': { to: 'footer' },
    'navbar': { to: 'navbar' }
  },

  // before: function(){
  //   var routeName = this.route.name;

  //   if(_.include([],routeName))
  //     return;

  //   var user = Meteor.user();
  //   if( !user ) {
  //     this.render( Meteor.loggingIn() ? this.loadingTemplate : 'login' );
  //     return this.stop();
  //   }
  // } 

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
      if( project.hash )
        // [FIXME] - free from session, maybe implement a waitOn wrapper - remove from router
        Meteor.call('openFile', project.hash+"/index.md", function(err, succ){
          Session.set('data',succ);
        });
      return project;
    },
    layoutTemplate: 'fullLayout'
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
    action: function(){
      GAnalytics.pageview("/editor");
      
      this.render('editor');
    }
  });

	this.route('player', {
		before: function(){
			if( !Session.get('text') ) this.redirect('editor');
			syncQue = new SyncQue();
		},
		waitOn: function(a,b){
			return Meteor.subscribe('text', Session.get('text'));
		},
		data: function(){
			return { ttsObject: Syncs.find(), syncQue: syncQue };
		},
		action: function(){

      GAnalytics.pageview("/player");
			// The Meteor.subscribe method subscribe to a collection of syncs, which
			// arn't sorted
			// It is important to sort them before pushing in the play queue
			
			var syncs = Syncs.find().fetch();
			var text = Session.get('text');
			
			// FIXME: ERROR: 2 same sentances in the text are loaded just once;
			syncs.sort( function(a,b){
				return _.indexOf( text, a.text ) - _.indexOf(text,b.text);
			});

			syncQue.initSounds( syncs );

			// Visuals
      // TODO: clean router and export it to the player module
			Deps.autorun( function(){
				var ele = syncQue.getElement();
        var pointer = syncQue.getPointer();

				if(ele) {
					// align the top position of the subtitles
					$('.textContainer center').css('margin-top',-1.35*pointer+'em');
					
					// mark the current line as active
					$('.textContainer center span').removeClass('playing');
          if( pointer != -1 )
            $('.textContainer center span#text_'+ele.hash).addClass('playing');

					// mark the current blob as active
					$('.processWrapper li').removeClass('playing');
					$('.processWrapper li#playstate_'+ele.hash).addClass('playing');
				}

			});

			this.render('player');
		}
	});
});
