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
    addAtom.apply( this, ['md'] );
    
    adding.set(false);
    
  },
  "click .tts-btn": function(e,t){
    e.preventDefault();
    
    addAtom.apply( this, ['tts'] );
    
    adding.set(false);
    
  },
  "click .ms-btn": function(e,t){
    e.preventDefault();
    
    addAtom.apply( this, ['multipleChoice'] );
    
    adding.set(false);
    
  },
  "click .comment-btn": function(e,t){
    e.preventDefault();
    
    // addAtom.apply( this, ['multipleChoice'] );
    // addAtom( 'comment', t.data.unit.rootId );
    
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
      Units.update({_id: unit._id},{$push: {ast: atom}});
    });
  } else {
    var commit = new CommitModel( unit._id );
    
    var atom =  LLMD.packageTypes[ name ].skeleton;
    atom.active = true;
    atom.name = name;
    commit.add( atom, [commit.ele.rootId] );
    
    Units.update({_id: unit._id},{$set: {commitId: commit.ele._id}});
  }
}
