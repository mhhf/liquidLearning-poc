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

			syncQue = new SyncQue({
				text: Session.get('text')
			});

			syncQue.initSounds( Syncs.find().fetch() );

			this.render('player');
		}
	});
});
