Template.atomWrapper.helpers({
  editMode: function(){
    return this.editMode.get();
  },
  editModeClass: function(){
    return this.editMode.get()?'edit':'';
  }
});

Template.atomWrapper.events = {
  "click .edit-btn": function(e,t){
    
    var ele = t.find('li');
    
    $(ele).css('min-height',ele.clientHeight + "px");
    
    e.preventDefault();
    this.editMode.set(true);
    redrawAtom.apply(t);
  },
  "click .save-btn": function(e,t){
    e.preventDefault();
    
    this.updateChange();
    this.editMode.set(false);
    redrawAtom.apply(t);
  },
  "click .dismiss-btn": function(e,t){
    e.preventDefault();
    
    this.editMode.set(false);
    redrawAtom.apply(t);
  }
  
}

Template.atomWrapper.rendered = function(){
  redrawAtom.apply(this);
}


redrawAtom = function(){

  var name = this.data.atom.name;
  var wrapper = this.find('.atomWrapper');
  var obj = this.data;
  var editMode = this.data.editMode.get();
  var mode = ( editMode )?'edit':'ast';
  $(wrapper).empty();

  var atomComp = UI.renderWithData(Template['llmd_'+name+'_'+mode], obj);
  UI.insert( atomComp, wrapper );

};
