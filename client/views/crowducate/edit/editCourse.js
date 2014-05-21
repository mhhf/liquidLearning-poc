var editMode = {
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


Template.editAside.events = {
  "click .add-section": function(e,t){
    var _id = this.data._id;
    console.log(_id);
    
    editMode.set(true);
    
  },
  "submit #newSectionForm": function(e,t){
    e.preventDefault();
    
    var name = t.find('input#newCourseName').value;
    
    // validate name: has to be uniqe
    
    var old = _.find(t.data.data.sections, function(o,i){
      return o.name == name;
    });
    
    if(old) {
      $('#newSectionNameHelper').removeClass('hidden').html('The name has to be unique!');
    } else {
      $('#newSectionNameHelper').addClass('hidden').html('');
      editMode.set(false);
      Courses.update({_id: t.data.data._id},{$push: {sections: { name: name, units: [] }}});
    }
    
  }
}

Template.editAside.rendered = function(){
  new Sortable(this.find('.sortable')); 
}

Template.editAside.helpers({
  getSections: function(a,b,c){
    if( !this.data ) return [];
    return _.map(this.data.sections, function( o, i ){
      o.index = i;
      return o;
    });
  },
  isSection: function( section, data ){
    return section.name == data.section;
  },
  editMode: function(){
    return editMode.get();
  },
  isSectionActive: function(data){
    return this.name == data.section?'active':'';
  }
});
