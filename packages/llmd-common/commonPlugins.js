IFPlugin = BasicPlugin.extend({
  // export to server? async?
  build: function( ctx, last ){
    
    var val = this.c && this.c.key && ctx.context[this.c.key];
    
    // check if value is there
    if( val == null && !last ) return false;
    
    if( val ) {
      return this.t;
    } else {
      return this.f;
    }
    
  },
  astTemplate: 'llmd_ast_if'
});


PluginHandler.registerPlugin( 'if', IFPlugin );

Template.llmd_if_body.helpers({
  getTrue: function(){
    return {
      atom: Atoms.findOne({ _id: this.atom.t }), 
      parents: this.parents.concat([ this.atom._id ])
    };
  },
  getFalse: function(){
    return {
      atom:Atoms.findOne({ _id: this.atom.f }),
      parents: this.parents.concat([ this.atom._id ])
    };
  }
});


Template.llmd_seq_edit.rendered = function(){
  new Sortable(this.find('#editorContainer'), {
    handle: '.sort-handle',
    onUpdate: function(e,a){
      var oldPos = e.srcElement.dataset.index;
      var newPos = e.srcElement.previousElementSibling && e.srcElement.previousElementSibling.dataset.index - 1 || 0;
      var parent = e.srcElement.parentElement;
      console.log(e);
    },
    group: 'seq'
  });
}

Template.llmd_seq_edit.helpers({
  getData: function( ctx ){
    // console.log('ctx',ctx);
    return {
      atom: this,
      index: ctx.atom.data.indexOf(this._id),
      parents: ctx.parents.concat([ ctx.atom._id ])
    }
  },
  isComment: function(){
    return this.name === 'comment';
  },
  getWrapper: function(){
    if( this.atom.name === 'comment') {
      return Template['commentWrapper'];
    } else if( this.atom.name === 'seq' ) {
      return Template['atomWrapper'];
    } else if( this.atom.name === 'if' ) {
      return Template['ifWrapper'];
    } else {
      return Template['atomWrapper'];
    }
  },
  atoms: function(){
    var atoms = _.map( this.atom.data, function(_id,a){
      var atom = Atoms.findOne({_id: _id});
      return atom;
    });
    return atoms;
  }
})

