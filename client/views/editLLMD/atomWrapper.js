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
    return ( this.atom.meta && this.atom.meta.active )?'':'inactive';
  },
  isActive: function(){
    return ( this.atom.meta && this.atom.meta.active );
  },
  dynamicTemplate: function(){
    
    var editMode = editHandler.get() === this;
    var mode = ( editMode )?'edit':'ast';
    var template = Template['llmd_'+this.atom.name+'_'+mode];
    return template;
  },
  getSmallSpinner: function(){
    return {
      lines: 11, // The number of lines to draw
      length: 4, // The length of each line
      width: 2, // The line thickness
      radius: 4, // The radius of the inner circle
      corners: 1, // Corner roundness (0..1)
      rotate: 0, // The rotation offset
      direction: 1, // 1: clockwise, -1: counterclockwise
      color: '#000', // #rgb or #rrggbb or array of colors
      speed: 1, // Rounds per second
      trail: 42, // Afterglow percentage
      shadow: false, // Whether to render a shadow
      hwaccel: false, // Whether to use hardware acceleration
      className: 'spinner', // The CSS class to assign to the spinner
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      top: '0', // Top position relative to parent
      left: '0' // Left position relative to parent 
    };
  },
  previewable: function(){
    return this.meta && this.meta.previewable && this.meta.state == "ready";
  },
  isPending: function(){
    return this.atom.meta && this.atom.meta.state == "pending";
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
    $(t.find('.atomContainer')).fadeOut(400, function(){
      editHandler.remove( self.parents.concat( [ self.atom._id ] ) );
      $(t.find('.atomContainer')).css('display','block');
    });
  },
  "click .save-btn": function(e,t){
    e.preventDefault();
    
    var atom = this.buildAtom();
    atom.name = this.atom.name;
    atom.meta = this.atom.meta || {};
    atom.meta.state = 'pending';
    editHandler.save( atom, this.parents.concat([ this.atom._id ]) );
    
  },
  "click .dismiss-btn": function(e,t){
    e.preventDefault();
    
    editHandler.dismiss();
  },
  "click .activate-toggle-btn": function(e,t){
    e.preventDefault();
    var atom = this.atom;
    atom.meta.active = !atom.meta.active;
    editHandler.save( atom, this.parents.concat([ this.atom._id ]) );
  }
  
}



