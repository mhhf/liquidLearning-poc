Template.projectView.events = {
  "click .star": function(){
    Meteor.call( 'updateProjectStar', this._id );
  },
  "click #buildBtn": function( e, t ){
    e.preventDefault();
    Meteor.call('projectBuildClient', this._id );
  }
}


Template.activities.activity = function(){
  return this.activity.reverse();
}
Template.activities.save = function(){
  return this.type == 'save';
}

Template.projectView.building = function(){
  return this.state == "building";
}
Template.projectView.needBuild = function(){
  return this.needBuild?'needBuild':'';
}

