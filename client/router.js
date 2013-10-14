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
			path: '/'
	});
});
