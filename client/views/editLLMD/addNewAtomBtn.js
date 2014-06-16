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



addAtom = function( name ){

  this.editorModel.commitModel.add( new LLMD.Atom( name ), parents );

}
