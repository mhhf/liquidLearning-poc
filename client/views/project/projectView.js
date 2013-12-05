Template.projectView.events = {
  "click .star": function(){
    Meteor.call( 'updateProjectStar', this._id );
  }
}
