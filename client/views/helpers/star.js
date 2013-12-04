Template.star.userHasStared = function(){
  return this.stars && this.stars.indexOf( Meteor.userId() ) > -1;
}

Template.star.stars = function(){
  var num = 0;
  if( this.stars && this.stars.length > 0 ) num = this.stars.length;
  return num;
}

updateStar = function( ctx, Collection ){
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
