Router.map( function(){

  this.route('feedbackNew', {
    path: '/feedback/new',
    waitOn: function(){
      return Meteor.subscribe('tags');
    },
    data: {
      ctx: 'feedback',
      tags: Tags.find(),
      onSuccess: function(){
        Router.go('feedback');
      }
    }
  });

  this.route('feedbackPost', {
    path: '/feedback/:_id',
    waitOn: function(){
      return Meteor.subscribe('post', this.params._id);
    },
    data: function(){
      return { post: Posts.findOne({ _id:this.params._id, root: null }) };
    }
  });

  this.route('feedback', {
    path: '/feedback',
    waitOn: function(){
      return Meteor.subscribe('feedback');
    },
    data: {
      posts: Posts.find({},{sort: {date:-1}}),
      postPath: 'feedbackPost'
    }
  });
  
});
