var parents;
Template.addNewAtomBtn.events({
  "click .add-btn": function(e,t){
    e.preventDefault();
    
    parents = this.parents.concat( this.atom._id );
    
    this.editorModel.set( 'choose', this );
  },
  "submit": function(e,t){
    e.preventDefault();
    
    var package = t.find('#newAtom').value;
    
    
    console.log( package );
    
  }
});

Template.addNewAtomBtn.helpers({
  editable: function(){
    return this.editorModel.editable;
  },
  isAdding: function(){
    var atom = this.editorModel.get('add');
    return atom && ( _.last( atom.parents ) == this.atom._id ) && this.key === atom.key;
  },
  isChoosing: function(){
    return this.editorModel.get('choose') == this;
  },
  tmpAtom: function(){
    return this.editorModel.get('add');
  } 
});

Template.selectLLMDTypes.helpers({
  atomTypes: function(){
    return _.keys(LLMD.packageTypes);
  }
});


Template.selectLLMDTypes.rendered = function(){
  var self = this;
  
  $('select').selectize({
    onChange: function( name ){
      self.data.editorModel.add( name, self.data.key );
    }
  })[0].selectize.focus();
}



addAtom = function( name ){

  this.editorModel.add( new LLMD.Atom( name ), parents );

}
