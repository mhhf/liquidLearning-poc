
Template.editLLMD.helpers({
  getData: function( ctx ){
    return {
      atom: this,
      index: ctx.unit.ast.indexOf(this)
    }
  }
});


Template.editLLMD.rendered = function(){
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

