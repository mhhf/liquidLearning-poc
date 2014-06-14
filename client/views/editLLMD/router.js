Router.map( function(){
  
  this.route('editCommit', {
    path: 'edit/commit/:_commitId',
    template: 'editLLMD',
    waitOn: function(){
      return Meteor.subscribe( 'commit', this.params._commitId );
    },
    data: function(){
      
      mediaHandler = new SyncQue();
      
      var commit = Commits.findOne({ _id: this.params._commitId });
      var rootAtom = Atoms.findOne({ _id: commit.rootId });
      
      return {
        head: commit,
        commitModel: new CommitModel( this.params._commitId ),
        mediaHandler: mediaHandler,
        root: rootAtom
      };
    }
    
  });
  
});
