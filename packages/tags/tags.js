Tags = new Meteor.Collection('tags', {
  schema: new SimpleSchema({
    name: {
      type: String,
      label: "Name"
    },
    counter: {
      type: Number,
      label: "Counter"
    }
  })
});

if( Meteor.isServer ) {

  Tags.extend = function(t){
    var tag,tagO;
    for(var i in t) {
      tag = t[i];
      tagO = Tags.findOne({ name: tag });
        
      if( tagO ) {
        Tags.update({ _id: tagO._id },{ $inc: { counter: 1 } });
      } else {
        Tags.insert({ name: tag, counter: 0 });
      }
      
    }
    return true;
  }

  Tags.allow({
    insert: function (userId, doc) {
      return true;
    },

  update: function (userId, doc, fieldNames, modifier) {
    return true;
  },

  remove: function (userId, doc) {
    return true;
  }
  });

  Tags.deny({
    insert: function (userId, doc) {
      return false;
    },

    update: function (userId, doc, fieldNames, modifier) {
      return false;
    },

    remove: function (userId, doc) {
      return false;
    }
  });


  Meteor.publish('tags', function () {
    return Tags.find();
  });
}
