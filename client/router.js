Router.configure({
  layoutTemplate: 'defaultLayout',

  notFoundTemplate: 'notFound',

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

  this.route('login', {
    path: '/login'
  });

  this.route('signup', {
    path: '/signup'
  });

  this.route('newproject', {
    path: '/new'
  });

  this.route('projects', {
    path: '/projects'
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
