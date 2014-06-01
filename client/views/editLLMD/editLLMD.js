var astModel = null;


Template.editLLMD.created = function(){
  astModel = new ASTModel( {name: this.data.lectureName} );
}

Template.editLLMD.helpers({
  atoms: function(){
    return astModel.getAtoms();
  },
  astModel: function(){
    return astModel;
  }
});


Template.editLLMD.rendered = function(){
  console.log(this.data);
  new Sortable(this.find('#editorContainer'), {
    handle: '.sort-handle',
    onUpdate: function(e,a){
      var oldPos = e.srcElement.dataset.index;
      var newPos = e.srcElement.previousElementSibling && e.srcElement.previousElementSibling.dataset.index - 1 || 0;
      var parent = e.srcElement.parentElement;
      console.log(e);
    }
  });
}

