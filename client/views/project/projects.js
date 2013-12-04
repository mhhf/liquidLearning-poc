Template.projectWrapper.helpers({
  //
  // cut title to 20 chars
  getTitle: function(){

    if(this.name.length > 20 )
      return this.name.slice(0,20)+"...";
    return this.name;
  },
  userOwn: function( back ){
    return this.user && ( Meteor.userId() == this.user._id );
  }
});

Template.projects.events = {
  "click .projectWrapper": function(e,t){
    Router.go('projectView', { _id: this._id });
  }
}
