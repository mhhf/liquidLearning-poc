DPosts = new Meteor.Collection('dPosts');


// [TODO] - security
Meteor.methods({
  newDPost: function( o ){
    
    var obj = _.pick(o,['title','message','ctx']);
    var user = {_id: 'null', name: 'anonymous' };

    if( Meteor.user() ) user = {
      _id: Meteor.userId(),
      name: Meteor.user().username 
    };

    obj = _.extend(obj,{
      stars:[],
      comments: [],
      user: user,
      date: new Date()
    });

    DPosts.insert(obj);

    return true;
  },
  updateFeedbackStar: function( _id ){
    var ctx = Feedback.findOne({_id: _id});
    if( ctx ) updateStar(ctx, Feedback);
  },
  addComment: function( o ){
    
    DPosts.update({_id: o._id},{$push:{comments:{
      message: o.msg,
      user: {
        name: Meteor.user().username,
        _id: Meteor.userId()
      },
      date: new Date()
    }}});
  }
});


