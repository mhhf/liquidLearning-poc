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
  return Projects.find({public:true});
});

// user
Meteor.publish('userProjects', function(o){
  return Projects.find({ "user._id":this.userId });
});




Meteor.methods({
  // [XXX] - check if user is alowed to read /write the file
  openFile: function( file ){
    var data = fs.readFileSync( path+file, "utf8" );
    console.log(data);
    return data;
  },
  // [question] - save just markdown or the parsed slides for speed? 
  // [todo] - commit with commit message
  saveFile: function( _id, o ){
    if( !( o.md && o.slidesLength && typeof o.slidesLength === 'number' && _id ) ) return false;

    var project = Projects.findOne({ _id: _id });
    if( !project ) return;

    fs.writeFileSync( path + project.hash + '/index.md', o.md );
    Projects.update({ _id: _id },{$set: { slides: o.slidesLength }});

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
    if( !( Meteor.user() && _.find( project.acl, function(e){
      return e._id == Meteor.userId(); 
    } ) ) ) return false;

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

  deleteProject: function( _id ){
    
    // find project
    var project = Projects.findOne({_id:_id});

    // no project found
    if( !project ) return false;

    var userAcl = _.find(project.acl, function(e){ return e._id = Meteor.userId(); });
    
    // user cant remove project
    if( !userAcl || userAcl.right != "admin" ) return false;

    // remove the repository
    deleteFolderRecursive( path+project.hash );

    Projects.remove({ _id: _id });

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

