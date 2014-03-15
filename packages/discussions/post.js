Template.discussionPost.getDate = function(){
  return moment(this.date).fromNow();
}


Template.discussionPost.events = {
  "click button[name=submit]": function(e,t){
    e.preventDefault();
    var msg = t.find('textarea').value;
    t.find('textarea').value = "";
    // [TODO] - export to server as a method
    Meteor.call('addComment', {
      _id: this._id,
      msg: msg
    });
  },
  "click a.replyBtn" : function(e,t){
    e.preventDefault();
    $(document.body).scrollTop($('#replyWrapper').offset().top);
  }
}


