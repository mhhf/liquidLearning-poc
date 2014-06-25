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

Router.onBeforeAction('loading');

Router.map(function() { 



  //////////////////////////////////////////////////////       LAYOUT
  ///////////////////////////////////////////////////////////////////////////

  this.route('login', {
    path: '/login'
  });
  
  this.route('testClient', {
    path: '/test/client'
  });
  
  this.route('testServer', {
    path: '/test/server'
  });

  this.route('signup', {
    path: '/signup'
  });

  this.route('home', {
		path: '/'
	});

  // this.route('editor',{
  //   waitOn: function(){

  //     return new SyncLoader('text');
  //   },
  //   action: function(){
  //     GAnalytics.pageview("/editor");

});
