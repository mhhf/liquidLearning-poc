Router.map( function(){
  this.route('dev', {
    waitOn: function(){
      return Meteor.subscribe('dev');
    },
    data: {
      posts: Posts.find({},{sort: {date:-1}}),
      postPath: 'feedbackPost'
    }
  });
  
  this.route('devNew', {
    path: '/dev/new',
    waitOn: function(){
      return Meteor.subscribe('tags');
    },
    data: {
      ctx: 'dev',
      tags: Tags.find(),
      onSuccess: function(){
        Router.go('dev');
      }
    }
  });

  this.route('devPost', {
    path: '/dev/:_id',
    waitOn: function(){
      return Meteor.subscribe('post', this.params._id);
    },
    data: function(){
      return { post: Posts.findOne({ _id:this.params._id, root: null }) };
    }
  });
  
});


