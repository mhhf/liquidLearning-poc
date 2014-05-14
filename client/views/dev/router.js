Router.map( function(){
  this.route('dev', {
    waitOn: function(){
      return Meteor.subscribe('Redisc.Posts',['dev']);
    },
    data: {
      posts: Redisc.Posts.find({root:null},{sort:{ score:-1, updatedOn: -1, createdOn: -1 }}),
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
      return Meteor.subscribe('Redisc.Post', this.params._id);
    },
    data: function(){
      return { post: Redisc.Posts.findOne({ _id:this.params._id, root: null }) };
    }
  });
  
});


