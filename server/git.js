var git = Meteor.require('nodegit');
var fs = Npm.require('fs');


Git = {
  
  commit: function( msg, path, project, data, filepath ) { 
    return commit( msg, path, project, data, filepath );
  },
  
  // [TODO] - recursive dir list
  buildTree: function(path, project) {
    // var files = fs.readdirSync(path+project.hash);
    return buildHeadTree( path, project );
    // return _.without(files,'.git');
  }
  
  
  
}

// DEBUG ONLEY
// Meteor.methods({
//   readAllFiles:function(path, project){
//     return raf(path, project);
//   }
// });

var buildHeadTreeAsync = function( path, project, cb ){
    var files = {};
    git.Repo.open(path+project.hash+'/.git', function(error, repo) {
      if (error) throw error;

      repo.getMaster(function(error, commit) {
        if (error) throw error;
        
        var history = commit.history(git.RevWalk.Sort.Time);
        
        // Sort relevant fiels via OID
        commit.getTree( function( err, tree ){

          tree.entries().forEach( function( entry ){
            files[entry.path()] = {
              oid: entry.oid().toString()
            }
          });

          buildModificationLog( history, files, cb );

        });
        
      });

    });
}
var buildHeadTree = Meteor._wrapAsync(buildHeadTreeAsync); 


function buildModificationLog( history, files, cb ) {
  
  history
  .on('commit', function(commit) {
    var treeId = commit.treeId();
    var msg = commit.message();
    commit.getTree( function(err, tree){
      tree.entries().forEach( function(entry){
        if ( !files[entry.path()] || files[entry.path()].oid != entry.oid() ) return false; 
        files[entry.path()] = {
          oid: entry.oid().toString(),
          msg: msg,
          timestamp: commit.timeMs()
        };
      });
    });
  })
  .on('end', function(){
    // Filter for oids, build array of objects
    cb(null, _.map(files, function(files, key){
      files.path = key;
      return _.omit(files,'oid');
    }));
  });
  
  history.start();
}




var commitAsync = function( msg, path, project, data, filepath, cb ){
  
    var sig = git.Signature.now(
        Meteor.user().username, 
        Meteor.user().emails[0].address
        );
    
    git.Repo.open( path + project.hash + '/.git' , function(openReporError, repo) {
      if (openReporError) throw openReporError;
      
      console.log('saving ' + path + project.hash + '/'+filepath);
      fs.writeFileSync( path + project.hash + '/'+filepath, data );
      
      repo.openIndex(function(openIndexError, index) {
        if (openIndexError) throw openIndexError;
        
        index.read(function(readError) {
        if (readError) throw readError;
          
          index.addByPath(filepath, function(addByPathError) {
          if (addByPathError) throw addByPathError;
            
            index.write(function(writeError) {
              if (writeError) throw writeError;
              
              index.writeTree(function(writeTreeError, oid) {
                if (writeTreeError) throw writeTreeError;
                 
                // lookup if there is a parant commit
                git.Reference.oidForName(repo, 'HEAD', function(oidForName, head) {
                  if (!oidForName) {
                  
                    repo.getCommit(head, function(getCommitError, parent) {
                    if (getCommitError) throw getCommitError;
                        
                      repo.createCommit('HEAD', sig, sig, msg, oid, [parent], function(error, commitId) {
                        cb(null, true);
                        
                      });
                      
                    });
                  } else {
                    
                    repo.createCommit('HEAD', sig, sig, msg, oid, [], function(error, commitId) {
                      
                      cb(null, true);
                    });
                  }
                  
                });
              });
            });
          });
        });
      });
      
    });
}
var commit = Meteor._wrapAsync(commitAsync);
