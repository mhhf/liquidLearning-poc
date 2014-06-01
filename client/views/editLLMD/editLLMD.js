var adding = {
  dep:	new Deps.Dependency,
  val: false,
  get: function(){
    this.dep.depend();
    return this.val;
  },
  set: function( val ){
    this.dep.changed();
    this.val = val;
  }
}

Template.editLLMD.helpers({
  atoms: function(){
    return this.astModel.getAtoms();
  },
  isAdding: function(){
    return adding.get();
  }
});

Template.editLLMD.rendered = function(){
  console.log(this.data);
  new Sortable(this.find('#editorContainer'), {
    handle: '.sort-handle'
  });
}

Template.editLLMD.events({
  "click .add-btn": function(e,t){
    e.preventDefault();
    
    adding.set(true);
    
  },
  "click .md-btn": function(e,t){
    e.preventDefault();
    
    t.data.astModel.add( LLMD.packageTypes['md'].skeleton );
    adding.set(false);
    
    // t.data.asts.push( obj );
    
  },
  "click .tts-btn": function(e,t){
    e.preventDefault();
    
    t.data.astModel.add( LLMD.packageTypes['tts'].skeleton );
    adding.set(false);
    // t.data.asts.push( obj );
    
  },
  "click .ms-btn": function(e,t){
    e.preventDefault();
    
    adding.set(false);
    var obj = ASTGetherer.newContext( {name:'multipleChoice', data: [] } );
    t.data.asts.push( obj );
    
  }
});
