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

Template.addNewAtomBtn.helpers({
  isAdding: function(){
    return adding.get();
  }
});

Template.addNewAtomBtn.events({
  "click .add-btn": function(e,t){
    e.preventDefault();
    
    adding.set(true);
    
  },
  "click .md-btn": function(e,t){
    e.preventDefault();
    
    this.astModel.add( LLMD.packageTypes['md'].skeleton );
    adding.set(false);
    
    // t.data.asts.push( obj );
    
  },
  "click .tts-btn": function(e,t){
    e.preventDefault();
    
    this.astModel.add( LLMD.packageTypes['tts'].skeleton );
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
