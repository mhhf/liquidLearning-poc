Meteor.methods({
  newFeedback: function( o ){
    var obj = _.pick(o,['title','message']);
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

    Feedback.insert(obj);

    return true;
  },
  updateFeedbackStar: function( _id ){
    var ctx = Feedback.findOne({_id: _id});
    if( ctx ) updateStar(ctx, Feedback);
  }
});
