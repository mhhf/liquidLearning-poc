Template.feedbackNew.events = {
  "click button[name=submit]": function(e,t){
    var title = t.find('input[name=title]').value;
    var msg = t.find('textarea[name=msg]').value;
    Meteor.call('newFeedback',{
      title: title,
      message: msg
    }, function(err, succ){
      Router.go('feedback');
    });

  }
}
