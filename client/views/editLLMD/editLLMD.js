
Template.editLLMD.rendered = function(){
}

Template.editLLMD.helpers({
  getRoot: function(){
    var atom = this.editorModel.wrapAtom( this.root );
    atom.parents = [];
    return atom;
  },
  isChanged: function(){
    return ( !this.root.meta.commit )?'changed':'';
  }
});


Template.editLLMD.events({
  "click .add-btn": function(e,t){
    e.preventDefault();
    
  },
  "click .md-btn": function(e,t){
    e.preventDefault();
    addAtom.apply( this, ['md'] );
    
  },
  "click .tts-btn": function(e,t){
    e.preventDefault();
    
    addAtom.apply( this, ['tts'] );
    
  },
  "click .ms-btn": function(e,t){
    e.preventDefault();
    
    addAtom.apply( this, ['multipleChoice'] );
    
  },
  "click .comment-btn": function(e,t){
    e.preventDefault();
    
  },
  "click .if-btn": function(e,t){
    e.preventDefault();
    
    addAtom.apply( this, ['if'] );
  },
  "click .commit-btn": function(e,t){
    e.preventDefault();
    
    var self = this;
    bootbox.prompt("What did you changed?", function(result) {                
      self.editorModel.commitModel.commit({
        msg: result
      });
    }); 
  },
  "click .fork-btn": function(){
    console.log('fork');
  },
});


Template.commentWrapper.helpers({
  postData: function(){
    if( this._id ) {
      Meteor.subscribe('Redisc.Post', this._id);
      return {post: Redisc.Posts.findOne({_id: this._id})};
    }
    return null;
  }
});


Template.diffWrapper.helpers({
  type: function(){
    return this.atom.meta.diff.type;
  }
});

var addNewBranch = {
  dep:	new Deps.Dependency,
  val: null,
  get: function(){
    this.dep.depend();
    return this.val;
  },
  set: function( val ){
    this.dep.changed();
    this.val = val;
  }
}

Template.branchSelector.events = {
  "click .create-branch-btn": function(){
    
    if( !this.root.meta.commit ) {
      
      bootbox.alert("Pleas Commit first!", function() {
        
      });
      return null;
    }
    
    addNewBranch.set( true );
  },
  "submit": function( e, t ){
    e.preventDefault();
    
    
    
    var name = t.find('[name=name]').value;
    
    var _branchId = LQTags.insert({ 
      name: name,
      _commitId: this.head._id,
      type: 'branch',
      _unitId: this.head._unitId
    });
    
    Router.go('branch.edit',{
      user: this.user,
      unit: this.unit.name,
      branch: name
    });
    
    addNewBranch.set( false );
  },
  "click .btn-dismiss": function(){
    addNewBranch.set( false );
  }
}

Template.branchSelector.helpers({
  isAdding: function(){
    return addNewBranch.get();
  },
  onBranch: function(){
    return this.branch;
  },
});

Template.selectBranch.helpers({
  isSelected: function( data ){
    return data.branch._id == this._id? 'selected':'';
  }
});
    
Template.selectBranch.rendered = function(){
  var self = this.data;
  $('.branchSelect').selectize({
    onChange: function( name ){
      
      Router.go('branch.edit', {
        user: self.user,
        unit: self.unit.name,
        branch: name
      });
      
    }
  });
}
