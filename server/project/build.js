Meteor.methods({

  // Build the Project AST
  buildProject: function( _id ){
    
    if(!_id) return false;
    
    var project = Projects.findOne( { _id: _id, $or:[{public:true},{'acl._id':this.userId}] } );
    
    var ast = LLMDBuilder.build( project );
    
    Projects.update({ _id: _id }, {$set: {
      ast: ast,
      build: {
        date: new Date()
      },
      state: 'ready',
      changed: false
    }});
    
    return true;
  }
});
