Router.map( function(){

  this.route('newProjectDiscussion', {
    path: '/project/:_id/discussion/new',
    data: function(){
      return {
        ctx: this.params._id,
        _id: this.params._id,
        reroute: 'projectDiscuss'
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
      return {
        post: DPosts.findOne({ '_id': this.params._id }),
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
