
Template.editLLMD.rendered = function(){
  $('.branchSelect').selectize({
  });
}

Template.editLLMD.helpers({
  getRoot: function(){
    var atom = this.editorModel.wrapAtom( this.root );
    atom.parents = [];
    return atom;
  },
  
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
  }
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
