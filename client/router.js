Router.configure({
  layout: 'defaultLayout',

  notFoundTemplate: 'notFound',

  loadingTemplate: 'loading',

  renderTemplates: { 
    'footer': { to: 'footer' },
  }

});


// TODO #router: make shoure that text object isn't empty, if it is redirect back to the editor
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
		waitOn: function(a,b){
			if( !Session.get('text') ) this.redirect('editor');
			return Meteor.subscribe('text', Session.get('text'));
		},
		data: function(){
			return {};
		}
	});
});
