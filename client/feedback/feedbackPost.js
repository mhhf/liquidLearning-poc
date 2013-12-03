Template.feedbackPost.rendered = function(){
  console.log(this);
}

Template.feedbackPost.getDate = function(){
  return timeSince(this.date);
}


Template.feedbackPost.events = {
  "click button[name=submit]": function(e,t){
    e.preventDefault();
    var msg = t.find('textarea').value;
    t.find('textarea').value = "";
    Feedback.update({_id: this._id},{$push:{comments:{
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


timeSince = function(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}
