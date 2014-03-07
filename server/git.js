var git = Meteor.require('nodegit');
var fs = Npm.require('fs');


Git = {
  
  commit: function( msg, path, project, data, filepath ) { 
    
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
                        
                      repo.createCommit('HEAD', sig, sig, msg, oid, [parent], function(error, commitId) {});
                      
                    });
                  } else {
                    
                    repo.createCommit('HEAD', sig, sig, msg, oid, [], function(error, commitId) {
                    });
                  }
                  
                });
              });
            });
          });
        });
      });
      
    });
    
  },
  
  // [TODO] - recursive dir list
  buildTree: function(path, project) {
    var files = fs.readdirSync(path+project.hash);
    
    return _.without(files,'.git');
  }
  
  
}
