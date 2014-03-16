Router.map( function(){

  // [TODO] - replace hooks with custom server function which adds posts to the collection - post activity out of this method
  this.route('newProjectDiscussion', {
    path: '/project/:_id/discussion/new',
    data: function(){
      return {
        ctx: this.params._id,
        _id: this.params._id,
        reroute: 'projectDiscuss',
        onSuccess: function(){
          Meteor.call('postActivity', {
            type:'post',
            msg: 'new post',
            _id: this.ctx
          });
          Router.go('projectDiscuss', this);
        }
      };
    }
  });

  this.route('projectDiscussionPost', {
    path: '/project/:ctx/discussion/:_id',
    waitOn: function(){
      return [
        Meteor.subscribe('discussionPost', this.params._id ),
        Meteor.subscribe('project', this.params.ctx )
      ] 
    },
    data: function(){
      var post = DPosts.findOne({ '_id': this.params._id }); 
      post.onComment = function(){
        Meteor.call('postActivity', {
          type:'comment',
          msg: 'new comment',
          _id: this.ctx
        });
      };
      return {
        post: post,
        project: Projects.findOne({_id: this.params.ctx }),
      };
    }
  });
  
  this.route('projectDiscuss', {
    path: '/project/:_id/discussion',
    waitOn: function(){
      return [
        Meteor.subscribe('projectDiscussion', this.params._id),
        Meteor.subscribe('project', this.params._id )
        ];
    },
    data: function(){
      return {
        project: Projects.findOne({_id: this.params._id }),
        posts: DPosts.find(),
        postPath: 'projectDiscussionPost'
      };
    }
  });
  
});
