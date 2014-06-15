var parents;
Template.addNewAtomBtn.events({
  "click .add-btn": function(e,t){
    e.preventDefault();
    
    parents = this.parents.concat( this.atom._id );
  }
});

Template.addNewAtomBtn.helpers({
  editable: function(){
    return this.editorModel.editable;
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
    
    // addAtom.apply( this, ['multipleChoice'] );
    // addAtom( 'comment', t.data.unit.rootId );
  },
  "click .if-btn": function(e,t){
    e.preventDefault();
    
    addAtom.apply( this, ['if'] );
    // addAtom( 'comment', t.data.unit.rootId );
  }
});

addAtom = function( name ){

  this.editorModel.commitModel.add( new LLMD.Atom( name ), parents );

}
