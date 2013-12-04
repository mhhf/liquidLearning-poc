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
  // [XXX] - check if user is alowed to read the file
  openFile: function( file ){
    var data = fs.readFileSync( path+file, "utf8" );
    console.log(data);
    return data;
  },
  saveFile: function( project, data ){
    fs.writeFileSync(path+project+'/index.md',data);
    return true;
  },
  projectNew: function(o){
    
    // check if every type is given
    if( !( o.name && o.description && (o.public != null) ) )
      return { type: 'err', subtype: 'nofields' };
      
    // check if name isn't already in the db
    if( Projects.findOne({name:o.name}) )
      return { type: 'err', subtype: 'name exists'}
      
    var hash = MD5.hash( o.name ).toString();
    var repo = createRepo(hash);
    if( !repo ) return {
      type: 'err',
      subtype: 'can not create repo',
      object: repo 
    };

    // create index page
    var index = fs.writeFileSync(path+hash+'/index.md','#Index\nthis is the index page');

    // extend the object
    o = _.extend(o,{
      user:{ 
        name:Meteor.user().name,
        _id: Meteor.userId(),
      },
      stars: [],
      hash: hash
    });

    var id = Projects.insert(o);
      return { type: 'suc', id: id };
    
  }
});

