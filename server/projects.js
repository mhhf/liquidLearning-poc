// 
// [TODO] - provide feedback to the user 
// http://www.nodegit.org/nodegit/#Repo-init
var git = Meteor.require('nodegit');
var fs = Npm.require('fs');
var path = "/Users/mhhf/llWd/";


var createRepoAsync = function( name, cb ){
  git.Repo.init(path+name, false, cb );
}
var createRepo = Meteor._wrapAsync(createRepoAsync);


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




// [TODO] - export user right check to function
Meteor.methods({
  openFile: function( projectId ){
    
    // check if project is valid
    var project = Projects.findOne({ _id: projectId });
    if( !project ) return null;

    // check if user can read the file
    if( !project.public && !userHashPermissions( project, 'read' )) return null;
    
    var data = fs.readFileSync( path+project.hash+'/index.md', "utf8" );
    return data;
  },
  // [question] - save just markdown or the parsed slides for speed? 
  // [todo] - commit with commit message
  saveFile: function( _id, o ){
    if( !( o.md && o.slidesLength && typeof o.slidesLength === 'number' && _id ) ) return false;
    
    var project = Projects.findOne({ _id: _id });
     
    // project has to be writable by user
    if( !project || !userHashPermissions(project, 'write') ) return null;
    
    fs.writeFileSync( path + project.hash + '/index.md', o.md );
    Projects.update({ _id: _id },{$set: { 
      slides: o.slidesLength,
      data: o.md,
      ast: o.ast
    }});
    
    return true;
  },
  
  
  
  // Build the ast
  // maps the syncs to the ast notes
  buildProject: function( _id ){
    
    // [TODO] - acl
    var project = Projects.findOne( { _id: _id } );
    var ast = project.ast;
    
    var notes =  _.filter(_.flatten(_.pluck(ast,'notes')), function( s ){
      return typeof s == 'string';
    });
    
    notes = _.uniq(notes);
    
    var endResult = [],
    // result = _.sortBy(Syncer.getSyncsForNotes( notes ), function(o){
    //   return o.i;
    // });
    
    result = _.map(Syncer.getSyncsForNotes( notes ), function(o){
      delete o.i;
      return o;
    });
    
    // Substitude the string with the syncs object
    // 
    var newAst = _.map(ast, function(o){ // each slide
      o.notes = _.map(o.notes, function(n){ // each note
        // Substitude note with syncObject
        if( typeof n == 'string' )
          return _.find(result, function(r){ return r.text == n; }); 
        return n;
      }); 
      return o;
    });
    
    Projects.update({ _id: _id }, {$set: {ast: newAst}});
    
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
      
    var hash = MD5.hash( Meteor.user().name+"@"+o.name ).toString();
    var repo = createRepo(hash);
    if( !repo ) return {
      type: 'err',
      subtype: 'can not create repo',
      object: repo 
    };

    // create index page
    var index = fs.writeFileSync(path+hash+'/index.md','#Index\nthis is the index page');

    // extend the object
    // [TODO] - refactor user to creator
    o = _.extend(o,{
      user:{ 
        name:Meteor.user().username,
        _id: Meteor.userId(),
      },
      hash: hash,
      stars: [],
      slides: 0,
      acl: [{
        _id: Meteor.userId(),
        name: Meteor.user().username,
        right: "admin"
      }]
    });

    var id = Projects.insert(o);
      return { type: 'suc', id: id };
    
  },
  updateProjectStar: function( _id ){
    var ctx = Projects.findOne({ _id: _id });
    if( ctx ) updateStar( ctx, Projects );
  },

  // [TODO] - add email support (invite for registration)
  addUserToProject: function( o ){
    
    // check if information is aviable
    if( !( o.user && o.right && o.projectId ) ) return false;
    
    // check if project exists
    var project = Projects.findOne({_id: o.projectId });

    // check if user is logged in and has the access rights to do so
    if( !project || !userHashPermissions(project, 'admin') ) return false;

    // look for user in the database
    var user = Meteor.users.findOne({ username: o.user });

    // if no user found or user is self then exit
    if( !user || user._id == Meteor.userId() ) return false;
    
    // remove aclUser if he is already in the list
    if( _.find(project.acl, function(e){ return e._id == user._id; }) ) {
      var newAcl = _.filter(project.acl, function(e){ return e._id != user._id; });
      Projects.update({_id: o.projectId}, {$set: {acl: newAcl }});
    }
    
    var aclUser = {
      _id: user._id,
      name: user.username,
      right: o.right
    };
    
    // update the project
    Projects.update({ _id: o.projectId }, {$push: { acl: aclUser }});
  },

  removeUserFromProject: function(o){
    //
    // check if information is aviable
    if( !( o.userId && o.projectId ) ) return false;

    // check if project exists
    var project = Projects.findOne({_id: o.projectId });

    // check if user is logged in and has the access rights to do so
    if( !project || !userHashPermissions(project, 'admin') ) return false;

    var newAcl = _.filter(project.acl, function(e){ return e._id != o.userId; });
    Projects.update({_id: o.projectId}, {$set: {acl: newAcl }});

    return true;

  },

  deleteProject: function( _id ){
    
    // find project
    var project = Projects.findOne({_id:_id});

    // no project found
    if( !project ) return false;

    if( !userHashPermissions(project, 'admin')) return false;

    // remove the repository
    deleteFolderRecursive( path+project.hash );

    Projects.remove({ _id: _id });

    return true;
  },

  updateProjectSettings: function(o){
    
    // check if all elements are rdy
    if( !( o.projectId && o.name && o.description && o.public ) ) return false;

    // grab project
    var project = Projects.findOne({_id: o.projectId });

    // check if project exists and user can admin it
    if( !project ) return false;
    var userAcl = _.find(project.acl, function(e){ 
      return e._id == Meteor.userId(); 
    });
    
    if( !userAcl || userAcl.right != "admin" ) return false;
    
    // pick the right values
    var obj = _.pick(o, ['name','description','public']);

    Projects.update({ _id: o.projectId }, {$set: obj });

    return true;
  }
});

// removes a folder recursivly
var deleteFolderRecursive = function(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};


var userHashPermissions = function( project, right ){
  var userId = Meteor.userId();
  var userAcl = _.find(project.acl, function(e){
    return e._id == userId;
  });
  if( !userAcl ) return false;

  return userRightToNumber( userAcl.right ) >= userRightToNumber( right );
}
var userRightToNumber = function( right ){
  return right=='admin'?3:(right=='write'?2:1);
}

