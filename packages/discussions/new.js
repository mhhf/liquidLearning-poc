Template.newDiscussionPost.events = {
  "click button[name=submit]": function(e,t){
    var title = t.find('input[name=title]').value;
    var msg = t.find('textarea[name=msg]').value;
    
    var self = this;
    
    // [TODO] - test if all fields are set
    Meteor.call('newDPost',{
      title: title,
      message: msg,
      ctx: this.ctx
    }, function(err, succ){
      self.onSuccess && self.onSuccess();
    });

  }
}
