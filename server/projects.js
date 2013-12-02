Meteor.publish('projects', function(o){
  return Projects.find();
});

Meteor.methods({
  newProject: function(o){
    console.log(o);
  }
});

