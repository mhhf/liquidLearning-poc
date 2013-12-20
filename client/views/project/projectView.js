Template.projectView.events = {
  "click .star": function(){
    Meteor.call( 'updateProjectStar', this._id );
  }
}


Template.activities.activity = function(){
  return this.activity.reverse();
}
Template.activities.save = function(){
  return this.type == 'save';
}
