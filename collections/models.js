ProjectModel = function( _id ){
  
  this.Collection = Projects;
  
  this.ele = this.Collection.findOne( _id );
  
  ACLInterface.apply( this );
  
  if( Meteor.isServer ) {
    GitInterface.apply( this );
  }
  
}