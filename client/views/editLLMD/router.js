Router.map( function(){
  
  
  this.route('branch.edit', {
    path: '/:user/:unit',
    template: 'editLLMD',
    waitOn: function(){
      return Meteor.subscribe( 'unit', this.params.user + this.params.unit );
    },
    data: function(){
      
      mediaHandler = new SyncQue();
      
      var unit = Units.findOne({ _id: this.params.user+this.params.unit });
      var branch = LQTags.findOne({ _id: unit.branch._id });
      var commit = Commits.findOne({ _id: branch._commitId });
      var rootAtom = Atoms.findOne({ _id: commit.rootId });
      
      var editorModel = new EditorModel({
        editable: true,
        commitModel: new CommitModel( branch._id )
      });
      
      return {
        head: commit,
        mediaHandler: mediaHandler,
        root: rootAtom,
        editorModel: editorModel,
        branch: branch
      };
    }
    
  });
  
  this.route('commit.view', {
    path: 'commit/:_commitId',
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
        root: rootAtom,
        editor: {
          edit: false
        },
        branch: LQTags.findOne({ _commitId: this.params._commitId })
      };
    }
    
  });
  
  
  this.route('commitHistory', {
    path: 'commit/:_commitId/history',
    waitOn: function(){
      return Meteor.subscribe( 'commitHistory', this.params._commitId );
    },
    data: function(){
      return {
        head: Commits.findOne({ _id: this.params._commitId })
      };
    }
  });
  
  
  this.route('atom.view', {
    template: 'editLLMD',
    
    path: 'atom/:_atomId',
    waitOn: function(){
      // [TODO] - subscribe on atoms which are used in the diff
      
      // return [
      //   Meteor.subscribe('commit',this.params._id1),
      //   Meteor.subscribe('commit',this.params._id2)
      // ];
      // return new SyncLectureLoader( this.params._diffId );
      return Meteor.subscribe('atom',this.params._atomId);
    },
    data: function(){
      return {
        // ast: Session.get('ast'),
        root: Atoms.findOne({ _id: this.params._atomId }),
        index: 0,
        editor: {
          edit: false,
          diff: true
        },
      }
      // return {
      //   commit1: Commits.findOne({ _id: this.params._id1 }),
      //   commit2: Commits.findOne({ _id: this.params._id2 })
      // }
    }
    
  });
  
  
});
