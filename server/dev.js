var git = Meteor.require('nodegit');
var fs = Npm.require('fs');

// [TODO] - export path to global settings
var path = "/Users/mhhf/llWd/";


Meteor.methods({
  buildTree: function( projectId ){
    
    var project = Projects.findOne({ _id: projectId });
    if( !project ) return null;
    
    var headState = Git.buildTree( path, project );
    
    Projects.update({_id: projectId},{
      $set:{
        head: headState
      }
    });
    
    return true;
  }
});
