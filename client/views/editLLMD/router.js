Router.map( function(){
  
  this.route('unit.edit', {
    path: '/lq/:user/:unit',
    template: 'editLLMD',
    waitOn: function(){
      return Meteor.subscribe( 'unit', this.params.user + this.params.unit );
    },
    data: function(){
      
      mediaHandler = new SyncQue();
      
      var unit = Units.findOne({ _id: this.params.user+this.params.unit });
      var branch = LQTags.findOne({ _id: unit.branch._id });
      var commit = Commits.findOne({ _id: branch._commitId });
      var rootAtom = Atoms.findOne({ _id: commit._rootId });
      
      var editorModel = new EditorModel({
        editable: true,
        commitModel: new CommitModel({ 
          _branchId: branch._id 
        })
      });
      
      return {
        head: commit,
        user: this.params.user,
        unit: unit,
        mediaHandler: mediaHandler,
        root: rootAtom,
        editorModel: editorModel,
        branch: branch,
        branches: LQTags.find({ _unitId: unit._id })
      };
    }
    
  });
  
  this.route('branch.edit', {
    path: '/lq/:user/:unit/:branch',
    template: 'editLLMD',
    waitOn: function(){
      return Meteor.subscribe( 'unit', this.params.user + this.params.unit );
    },
    data: function(){
      
      mediaHandler = new SyncQue();
      
      var unit = Units.findOne({ _id: this.params.user+this.params.unit });
      var branch = LQTags.findOne({ name: this.params.branch, _unitId: unit._id });
      var commit = Commits.findOne({ _id: branch._commitId });
      var rootAtom = Atoms.findOne({ _id: commit._rootId });
      
      var editorModel = new EditorModel({
        editable: true,
        commitModel: new CommitModel({ 
          _branchId: branch._id 
        })
      });
      
      return {
        head: commit,
        user: this.params.user,
        unit: unit,
        mediaHandler: mediaHandler,
        root: rootAtom,
        editorModel: editorModel,
        branch: branch,
        branches: LQTags.find({ _unitId: unit._id })
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
      
      var editorModel = new EditorModel({
        editable: false,
        commitModel: new CommitModel( {
          _commitId: this.params._commitId
        } )
      });
      
      mediaHandler = new SyncQue();
      
      var commit = Commits.findOne({ _id: this.params._commitId });
      var rootAtom = Atoms.findOne({ _id: commit._rootId });
      
      return {
        head: commit,
        editorModel: editorModel,
        root: rootAtom,
        mediaHandler: mediaHandler
      };
    }
    
  });
  
  
  this.route('commit.history', {
    template: 'commitHistory',
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
