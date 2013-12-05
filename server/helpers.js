updateStar = function( ctx, Collection ){
  if( Meteor.userId() ) {
    if( !ctx.stars ) {
      Collection.update({ _id: ctx._id },{$set:{ stars: [ Meteor.userId() ] }});
      return;
    }
    if( ctx.stars.indexOf( Meteor.userId() ) > -1 ) {
      Collection.update({ _id: ctx._id },{ $pull: { stars: Meteor.userId() }});
    } else {
      Collection.update({ _id: ctx._id },{ $push: { stars: Meteor.userId() }});
    }
  }
}
