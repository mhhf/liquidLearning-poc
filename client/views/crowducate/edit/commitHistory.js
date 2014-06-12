Template.commitHistory.helpers({
  getHistory: function(){
    return Commits.find();
  }
});
