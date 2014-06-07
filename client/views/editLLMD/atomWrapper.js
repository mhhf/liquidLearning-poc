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
  this.save = function( atom, ids ){
    var unit = Units.findOne();
    var obj = {};
    
    var commit = new CommitModel( unit._id );
    
    commit.change(_.omit(atom,'_id'), ids);
      
    this.set(null);
  },
  this.dismiss = function(){
    this.set(null);
  },
  this.remove = function( ids ){
    var _id = Units.findOne()._id;
    
    var commit = new CommitModel( _id );
    commit.remove( ids );
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
    console.log('removing',this);
    $(t.find('.atomContainer')).fadeOut(400, function(){
      editHandler.remove( self.parents.concat( [ self.atom._id ] ) );
      $(t.find('.atomContainer')).css('display','block');
    });
  },
  "click .save-btn": function(e,t){
    e.preventDefault();
    
    var atom = this.buildAtom();
    atom.name = this.atom.name;
    atom.active = this.atom.active;
    editHandler.save( atom, this.parents.concat([ this.atom._id ]) );
    
  },
  "click .dismiss-btn": function(e,t){
    e.preventDefault();
    
    editHandler.dismiss();
  },
  "click .activate-toggle-btn": function(e,t){
    e.preventDefault();
    var atom = this.atom;
    atom.active = !atom.active;
    editHandler.save( atom, [ this.seqId, this.atom._id ] );
  }
  
}



