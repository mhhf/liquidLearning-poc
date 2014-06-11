var parents;
Template.addNewAtomBtn.events({
  "click .add-btn": function(e,t){
    e.preventDefault();
    
    parents = this.parents.concat( this.atom._id );
  }
});


Template.editLLMD.events({
  "click .add-btn": function(e,t){
    e.preventDefault();
    
  },
  "click .md-btn": function(e,t){
    e.preventDefault();
    addAtom.apply( this, ['md'] );
    
  },
  "click .tts-btn": function(e,t){
    e.preventDefault();
    
    addAtom.apply( this, ['tts'] );
    
  },
  "click .ms-btn": function(e,t){
    e.preventDefault();
    
    addAtom.apply( this, ['multipleChoice'] );
    
  },
  "click .comment-btn": function(e,t){
    e.preventDefault();
    
    // addAtom.apply( this, ['multipleChoice'] );
    // addAtom( 'comment', t.data.unit.rootId );
  },
  "click .if-btn": function(e,t){
    e.preventDefault();
    
    addAtom.apply( this, ['if'] );
    // addAtom( 'comment', t.data.unit.rootId );
  }
});

addAtom = function( name ){
  var unit = Units.findOne();
  var commit = new CommitModel( unit._id );

  var atom =  new LLMD.packageTypes[ name ].skeleton();
  atom.meta = {
    active: true,
    state: 'pending'
  }
  atom.name = name;
  commit.add( atom, parents );

  Units.update({_id: unit._id},{$set: {commitId: commit.ele._id}});
}
