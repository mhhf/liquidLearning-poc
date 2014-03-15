DPosts = new Meteor.Collection('dPosts');

if( Meteor.isServer ) {
  // Meteor.publish('dPosts', function(){
  //   return DPosts.find({});
  // });
}
if( Meteor.isClient ) {
  // Meteor.subscribe('dPosts');
}


Meteor.methods({
  newDPost: function( o ){
    
    // [TODO] - text if all fields are set
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
  }
});
