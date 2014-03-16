Router.map( function(){

  this.route('feedbackNew', {
    path: '/feedback/new',
    data: {
      ctx: 'feedback',
      reroute: 'feedback'
    }
  });

  this.route('feedbackPost', {
    path: '/feedback/:_id',
    waitOn: function(){
      return Meteor.subscribe('feedbackPost', this.params._id);
    },
    data: function(){
      return DPosts.findOne({ '_id': this.params._id });
    }
  });

  this.route('feedback', {
    path: '/feedback',
    waitOn: function(){
      return Meteor.subscribe('feedback');
    },
    data: {
      posts: DPosts.find({},{sort: {date:-1}}),
      postPath: 'feedbackPost'
    }
  });
  
});
