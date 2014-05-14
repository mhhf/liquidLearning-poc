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
      return Meteor.subscribe('Redisc.Post', this.params._id);
    },
    data: function(){
      return { post: Redisc.Posts.findOne({ _id:this.params._id, root: null }) };
    }
  });

  this.route('feedback', {
    path: '/feedback',
    waitOn: function(){
      return Meteor.subscribe('Redisc.Posts', ['feedback']);
    },
    data: {
      posts: Redisc.Posts.find({root:null},{sort:{ score:-1, updatedOn: -1, createdOn: -1 }}),
      postPath: 'feedbackPost'
    }
  });
  
});
