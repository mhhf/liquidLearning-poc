Meteor.methods({
  projectBuildClient: function(_id) {
    Projects.update({ _id: _id }, { $set: {state: 'building'} });
    Meteor.call('buildProject', _id);
  }
});
