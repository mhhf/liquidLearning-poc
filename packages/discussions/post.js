Template.discussionPost.rendered = function(){
  console.log(this);
}

Template.discussionPost.getDate = function(){
  return timeSince(this.date);
}


Template.discussionPost.events = {
  "click button[name=submit]": function(e,t){
    e.preventDefault();
    var msg = t.find('textarea').value;
    t.find('textarea').value = "";
    // [TODO] - export to server as a method
    DPosts.update({_id: this._id},{$push:{comments:{
      message: msg,
      user: {
        name: Meteor.user().username,
        _id: Meteor.userId()
      },
      date: new Date()
    }}});
  },
  "click a.replyBtn" : function(e,t){
    e.preventDefault();
    $(document.body).scrollTop($('#replyWrapper').offset().top);
  }
}
