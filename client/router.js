Router.configure({
  layout: 'defaultLayout',

  notFoundTemplate: 'notFound',

  loadingTemplate: 'loading',

  renderTemplates: { 
    'footer': { to: 'footer' },
  }

});


Router.map(function() { 
  this.route('home', {
		path: '/',
		data: function(){
			var tmpData = { syncs: Syncs.find() }
			return tmpData;
		}
	});

	this.route('editor');

	this.route('player', {
		before: function(){
			if( !Session.get('text') ) this.redirect('editor');
		},
		waitOn: function(a,b){
			return Meteor.subscribe('text', Session.get('text'));
		},
		data: function(){
			return { ttsObject: Syncs.find() };
		},
		action: function(){

			// The Meteor.subscribe method subscribe to a collection of syncs, which
			// arn't sorted
			// It is important to sort them before pushing in the play queue
			
			var syncs = Syncs.find().fetch();
			var text = Session.get('text');

			syncs.sort( function(a,b){
				return _.indexOf( text, a.text ) - _.indexOf(text,b.text);
			});

			syncQue = new SyncQue();

			syncQue.initSounds( syncs );

			this.render('player');
		}
	});
});
