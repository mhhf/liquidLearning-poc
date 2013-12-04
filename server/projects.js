
// publish public & user projects
//
// public
Meteor.publish('publicProjects', function(o){
  return Projects.find({public:true});
});
// user
Meteor.publish('userProjects', function(o){
  return Projects.find({ "user._id":this.userId });
});

Meteor.methods({
  projectNew: function(o){
    
    // check if every type is given
    if( !( o.name && o.description && (o.public != null) ) )
      return { type: 'err', subtype: 'nofields' };
      
    // check if name isn't already in the db
    if( Projects.findOne({name:o.name}) )
      return { type: 'err', subtype: 'name exists'}
      
    // extend the object
    o = _.extend(o,{
      user:{ 
        name:Meteor.user().name,
        _id: Meteor.userId()
      },
      stars: [],
    });

    var id = Projects.insert(o);
      return { type: 'suc', id: id };
    
  }
});

