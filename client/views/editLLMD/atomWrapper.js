var editHandler = new function(){
  this.dep =	new Deps.Dependency,
  this.val = null,
  this.get = function(){
    this.dep.depend();
    return this.val;
  },
  this.set = function( val ){
    this.dep.changed();
    this.val = val;
  },
  this.save = function( atom, index ){
    var _id = Units.findOne()._id;
    var obj = {};
    obj['ast.'+index] = atom;
    console.log('save', obj);
    Units.update({_id: _id}, {$set: obj});
    this.set(null);
  },
  this.dismiss = function(){
    this.set(null);
  },
  this.remove = function( atom ){
    var _id = Units.findOne()._id;
    Units.update({_id: _id}, {$pull: {'ast':atom} });
  }
}




Template.atomWrapper.rendered = function(){
}


Template.atomWrapper.helpers({
  editMode: function(){
    return editHandler.get() === this;
  },
  editModeClass: function(){
    return ( editHandler.get() === this )?'edit':'';
  },
  getActivateClass: function(){
    return ( this.atom.active )?'':'inactive';
  },
  isActive: function(){
    return ( this.atom.active );
  },
  dynamicTemplate: function(){
    
    var editMode = editHandler.get() === this;
    var mode = ( editMode )?'edit':'ast';
    var template = Template['llmd_'+this.atom.name+'_'+mode];
    return template;
  }
});

Template.atomWrapper.events = {
  "click .edit-btn": function(e,t){
    e.preventDefault();
    
    // perserve height
    var ele = t.find('li');
    $(ele).css('min-height',ele.clientHeight + "px");
    
    editHandler.set(this);
  },
  "click .remove-btn": function(e,t){
    var self = this;
    console.log('removing',this.index);
    console.log(t.find('.atomContainer'));
    $(t.find('.atomContainer')).fadeOut(400, function(){
      editHandler.remove( self.atom );
      $(t.find('.atomContainer')).css('display','block');
    });
  },
  "click .save-btn": function(e,t){
    e.preventDefault();
    
    var atom = this.buildAtom();
    atom.name = this.atom.name;
    atom.index = this.index;
    atom.active = this.atom.active;
    atom.parent = '';
    editHandler.save( atom, this.index );
  },
  "click .dismiss-btn": function(e,t){
    e.preventDefault();
    
    editHandler.dismiss();
  },
  "click .activate-toggle-btn": function(e,t){
    e.preventDefault();
    var atom = this.atom;
    atom.active = !atom.active;
    editHandler.save( atom, this.index );
  }
  
}



