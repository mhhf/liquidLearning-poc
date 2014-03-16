Template.discussionPost.getDate = function(){
  return moment(this.date).fromNow();
}


Template.discussionPost.events = {
  "click button[name=submit]": function(e,t){
    e.preventDefault();
    var msg = t.find('textarea').value;
    t.find('textarea').value = "";
    var self = this;
    
    Meteor.call('addComment', {
      _id: this._id,
      msg: msg
    }, function(err, succ){
      self.onComment && self.onComment();
    });
  },
  "click a.replyBtn" : function(e,t){
    e.preventDefault();
    $(document.body).scrollTop($('#replyWrapper').offset().top);
  }
}


