Template.atomWrapper.helpers({
  editMode: function(){
    return this.editHandler.get();
  },
  editModeClass: function(){
    return this.editHandler.get()?'edit':'';
  }
});

Template.atomWrapper.events = {
  "click .edit-btn": function(e,t){
    e.preventDefault();
    
    // perserve height
    var ele = t.find('li');
    $(ele).css('min-height',ele.clientHeight + "px");
    
    this.editHandler.set(true);
    redrawAtom.apply(t);
  },
  "click .save-btn": function(e,t){
    e.preventDefault();
    
    this.editHandler.save();
    redrawAtom.apply(t);
  },
  "click .dismiss-btn": function(e,t){
    e.preventDefault();
    
    this.editHandler.dismiss();
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
  var editMode = this.data.editHandler.get();
  var mode = ( editMode )?'edit':'ast';
  $(wrapper).empty();

  var atomComp = UI.renderWithData(Template['llmd_'+name+'_'+mode], obj);
  UI.insert( atomComp, wrapper );

};
