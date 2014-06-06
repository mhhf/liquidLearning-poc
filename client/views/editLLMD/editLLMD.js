
Template.editLLMD.helpers({
  getData: function( ctx ){
    return {
      atom: this,
      index: ctx.unit.ast.indexOf(this)
    }
  },
  isComment: function(){
    return this.name === 'comment';
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

Template.commentWrapper.helpers({
  postData: function(){
    if( this._id ) {
      Meteor.subscribe('Redisc.Post', this._id);
      return {post: Redisc.Posts.findOne({_id: this._id})};
    }
    return null;
  }
});
