Schemas = {
  Common: {
    Owner: new SimpleSchema({
      owner: {
        type: Object
      },
      'owner.name': {
        type: String,
        autoValue: function(  ){
          if( this.isInsert ) {
            return Meteor.user().username
          }
        }
      },
      'owner._id': {
        type: String,
        autoValue: function(  ){
          if( this.isInsert ) {
            return Meteor.userId()
          }
        }
      }
    })
  }
}
