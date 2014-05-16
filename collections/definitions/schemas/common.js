Schemas = {
  Common: {
    ACL: new SimpleSchema({
      acl: {
        type: [Object],
        // Makes the creator an admin
        autoValue: function(){
          if( this.isInsert ) {
            return [{
              _id: Meteor.userId(),
              name: Meteor.user().username,
              right: 'admin'
            }];
          }
        }
      },
      'acl.$._id': {
        type: String
      },
      'acl.$.name': {
        type: String
      },
      'acl.$.right': {
        type: String
      }
    }),
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
