var git = Meteor.require('nodegit');
var fs = Npm.require('fs');
var path = "/Users/mhhf/llWd/";


Meteor.methods({
  createProjectRepo: function( name ){
    var repo = createRepo( name );
    console.log(repo);
    return repo;
  }
});

var createRepoAsync = function( name, cb ){
  git.Repo.init(path+name, false, cb );
}
var createRepo = Meteor._wrapAsync(createRepoAsync);
