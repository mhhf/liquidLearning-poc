// [TODO] - export path to global settings
var path = "/Users/mhhf/llWd/";


// publish public & user projects
//
// public
Meteor.publish('publicProjects', function(o){
  return Projects.find({$or:[{public:true},{'acl._id':this.userId}]});
});

// user
Meteor.publish('userProjects', function(o){
  return Projects.find({ "user._id":this.userId });
});

Meteor.publish('project', function(_id){
  return Projects.find({ _id: _id, $or:[{public:true},{'acl._id':this.userId}] });
});


Meteor.methods({
  openFile: function( _id, filepath ){
    
    var project = Projects.findOne({ _id: _id });
    ACL( project ).check( 'read' );
    
    return Git.openFile( path+project.hash+'/'+filepath );
  },
  saveFile: function( _id, o ){
    if( !( o.md && _id && o.filepath ) ) return false;
    
    var project = Projects.findOne({ _id: _id });
    
    ACL(project).check('write');
    
    Git.commit( o.commitMsg, path + project.hash, o.md, o.filepath );
    
    var headState = Git.buildTree( path + project.head );
    
    Projects.update({ _id: _id },{
      $set: { 
        slides: o.slidesLength,
        data: o.md,
        state: 'changed',
        head: headState
      }
    });
    
    postActivity( {
      _id: _id,
      type: 'save',
      msg: o.commitMsg
    });
    
    return true;
  },
  
  
  postActivity: function(o){
    
    postActivity( {
      _id: o._id,
      type: o.type,
      msg: o.msg
    });
    
    return true;
  },
  
  projectNew: function(o){

    // check if user is logged in
    if( !Meteor.user() ) return { type: 'err', subtype: 'user not logged in' };
    
    // check if every type is given
    if( !( o.name && o.description && (o.public != null) ) )
      return { type: 'err', subtype: 'nofields' };
      
    // check if name isn't already in the db
    if( Projects.findOne({ name:o.name, 'user._id':Meteor.userId() }) )
      return { type: 'err', subtype: 'name exists'}
      
    // var hash = MD5.hash( Meteor.user().name+"_"+o.name ).toString();
    var hash = Meteor.user().username+"_"+o.name;
    
    // create index page
    Git.init( hash, path );
    Git.commit( 'init project', path + hash, '#Index\nthis is the index page', 'index.lmd' );
    var headState = Git.buildTree( path + hash );
    var build = LLMDBuilder.build( hash, 'en' );

    // extend the object
    // [TODO] - refactor user to creator
    o = _.extend(o,{
      hash: hash,
      head: headState,
      ast: build.ast,
      ctx: build.ctx,
      language: 'en'
    });
    
    var _id = Projects.insert(o);
    
    postActivity( {
      _id: _id,
      type: 'save',
      msg: 'create project'
    });
    
    return { type: 'suc', id: _id };
    
  },
  updateProjectStar: function( _id ){
    var ctx = Projects.findOne({ _id: _id });
    if( ctx ) updateStar( ctx, Projects );
  },

  addUserToProject: function( o ){
    
    // check if project exists
    var project = Projects.findOne({_id: o.projectId });
    ACL( project )
      .check('admin')
      .addUser( o.user, o.right, function( acl ){
        Projects.update({_id: o.projectId}, {$set: {acl: acl }});
      });
    
  },

  removeUserFromProject: function(o){

    // check if project exists
    var project = Projects.findOne({_id: o.projectId });
    ACL( project )
      .check('admin')
      .removeUser( o.userId, function( acl ){
        Projects.update({_id: o.projectId}, {$set: {acl: acl }});
      });


    return true;

  },

  deleteProject: function( _id ){
    
    // find project
    var project = Projects.findOne({_id:_id});

    ACL(project).check('admin');

    // remove the repository
    Git.remove( path + project.hash );

    Projects.remove({ _id: _id });

    return true;
  },

  updateProjectSettings: function(o){
    
    // grab project
    var project = Projects.findOne({_id: o.projectId });

    ACL(project).check('admin');
    
    // pick the right values
    var obj = _.pick(o, ['name','description','public','language']);
    Projects.update({ _id: o.projectId }, {$set: obj });

    return true;
  },
  
  // Build the Project AST
  buildProject: function( _id ){
    
    if(!_id) return false;
    
    var project = Projects.findOne( { _id: _id } );
    ACL(project).check('write');
    
    var build = LLMDBuilder.build( project );
    
    
    Projects.update({ _id: _id }, {$set: {
      ast: build.ast,
      ctx: build.ctx,
      state: 'ready',
      changed: false
    }});
    
    return true;
  }
  
});



var postActivity = function( o ) {
  Projects.update({ _id: o._id }, {
    $push: {
      activity: {
        user: {
          name: Meteor.user().username,
          _id: Meteor.userId()
        },
        date: new Date(),
        type: o.type,
        msg: o.msg
      }
    }
  });
}
