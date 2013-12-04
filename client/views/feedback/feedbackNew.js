Template.feedbackNew.events = {
  "click button[name=submit]": function(e,t){
    var title = t.find('input[name=title]').value;
    var msg = t.find('textarea[name=msg]').value;
    Feedback.insert({
      title: title,
      message: msg,
      user: {
        name: Meteor.user().username,
        _id: Meteor.userId()
      },
      date: new Date(),
      stars: [],
      comments: []
    });
    Router.go('feedback');
  }
}
