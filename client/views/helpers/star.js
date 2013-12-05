Template.star.userHasStared = function(){
  return this.stars && this.stars.indexOf( Meteor.userId() ) > -1;
}

Template.star.stars = function(){
  var num = 0;
  if( this.stars && this.stars.length > 0 ) num = this.stars.length;
  return num;
}

