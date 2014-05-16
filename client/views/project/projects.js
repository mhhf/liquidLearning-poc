Template.projectWrapper.helpers({
  //
  // cut title to 20 chars
  getTitle: function(){

    if(this.name.length > 20 )
      return this.name.slice(0,20)+"...";
    return this.name;
  },
  userOwn: function( back ){
    return this.owner && ( Meteor.userId() == this.owner._id );
  }
});

Template.projects.events = {
  "click .projectWrapper": function(e,t){
    Router.go('projectView', { _id: this._id });
  }
}

Template.showContributor.userIsContributor = function(){
  if( !this.acl ) return false;
  var userAcl = _.find(this.acl,function(e){return e._id == Meteor.userId();});
  return userAcl && (userAcl.right == 'write' || userAcl.right == 'admin');
}

Template.showContributor.userIsReader = function(){
  if( !this.acl ) return false;
  var userAcl = _.find(this.acl,function(e){return e._id == Meteor.userId();});
  return userAcl && (userAcl.right == 'read');

}


