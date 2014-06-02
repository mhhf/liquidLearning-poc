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
    
    var _id = Units.findOne()._id;
    var atom =  LLMD.packageTypes['md'].skeleton;
    Units.update({_id: _id},{$push: {ast: atom}});
    
    adding.set(false);
    
  },
  "click .tts-btn": function(e,t){
    e.preventDefault();
    
    var _id = Units.findOne()._id;
    var atom =  LLMD.packageTypes['tts'].skeleton;
    Units.update({_id: _id},{$push: {ast: atom}});
    
    adding.set(false);
    
  },
  "click .ms-btn": function(e,t){
    e.preventDefault();
    
    adding.set(false);
    var obj = ASTGetherer.newContext( {name:'multipleChoice', data: [] } );
    t.data.asts.push( obj );
    
  }
});
