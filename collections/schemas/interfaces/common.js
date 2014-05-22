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
    }),
    Common: new SimpleSchema({
      name: {
        type: String
      },
      description: {
        type: String
      },
      language: {
        type: String,
        defaultValue: 'en'
      },
      public: {
        type: Boolean,
        defaultValue: false
      }
    }),
    Git: new SimpleSchema({
      hash: {
        type: String,
        autoValue: function(){
          if( this.isInsert ) {
            var _id = this.field('owner').value._id;
            var name = this.field('name').value;
            var lang = this.field('language').value;
            var hash = _id+'_'+name+'_'+lang;
            return hash;
          }
        }
      },
      head: {
        type: [Object],
        defaultValue: []
      },
      'head.$': {
        type: Object,
        blackbox: true
      }
    }),
    Activity: new SimpleSchema({
      activity: {
        type: [Object],
        defaultValue: [],
        blackbox: true
      },
      'activity.$': {
        type: Object,
        blackbox: true
      }
    }),
    Stars: new SimpleSchema({
      stars: {
        type: [String],
        defaultValue: []
      }
    }),
    LLMD: new SimpleSchema({
      ast: {
        type: [Object],
        blackbox: true,
        defaultValue: []
      },
      'ast.$': {
        type: Object,
        blackbox: true
      },
      ctx: {
        type: Object,
        blackbox: true,
        defaultValue: {}
      }
    })
  }
}
