Template.posts.comments = function(){
  return comments(this.comments && this.comments.length);
}

var comments = function( num ){
  if( !num || num == 0 )
    return "no comments";
  if( num == 1 )
    return "1 comment";
  return num+" comments";
}

Template.posts.getDate = function(){
  return moment(this.date).fromNow();
}
