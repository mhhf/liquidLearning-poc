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
    
    addAtom( 'md' );
    
    adding.set(false);
    
  },
  "click .tts-btn": function(e,t){
    e.preventDefault();
    
    addAtom( 'tts' );
    
    adding.set(false);
    
  },
  "click .ms-btn": function(e,t){
    e.preventDefault();
    
    addAtom( 'multipleChoice' );
    
    adding.set(false);
    
  },
  "click .comment-btn": function(e,t){
    e.preventDefault();
    
    addAtom( 'comment' );
    
    adding.set(false);
  }
});

addAtom = function( name ){
  var unit = Units.findOne();
  if( name === 'comment' ) {
    var atom = {};
    Meteor.call('post.new', {title:'comment', data:'omgdata'}, function(err, _id ){
      console.log(_id);
      atom.active = true;
      atom.index = unit.ast.length;
      atom.name = name;
      atom._id = _id;
      atom.parent = '';
      Units.update({_id: unit._id},{$push: {ast: atom}});
    });
  } else {
    var atom =  LLMD.packageTypes[ name ].skeleton;
    atom.active = true;
    atom.index = unit.ast.length;
    atom.name = name;
    atom.parent = '';
    Units.update({_id: unit._id},{$push: {ast: atom}});
  }
}
