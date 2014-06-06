var editState = {
  dep:	new Deps.Dependency,
  val: null, // null, lecture, section
  get: function(){
    this.dep.depend();
    return this.val;
  },
  set: function( val ){
    this.dep.changed();
    this.val = val;
  }
}

var currentSection = {
  dep:	new Deps.Dependency,
  val: null,
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
  "click li.section > a": function(e,t){
    e.preventDefault();
    
    var target = e.currentTarget.dataset.target;
    currentSection.set( target )
  },
  "click .add-section": function(e,t){
    var _id = this.data._id;
    
    editState.set('section');
    
  },
  "click .add-lecture": function(e,t){
    e.preventDefault();
    
    
    editState.set('lecture');
    
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
      
      editState.set(null);
      Courses.update({_id: t.data.data._id},{$push: {sections: { name: name, units: [], index: t.data.data.sections.length + 1 }}});
    }
  },
  "submit #newLectureForm": function(e,t){
    e.preventDefault();
    
    var name = t.find('input#newLectureName').value;
    
    // unique name required ! check this
    
    var old = _.find(_.pluck(_.flatten(_.pluck(t.data.data.sections,'units')), 'name'), function(oldName){
      return oldName === name;
    });
    
    if( old ) {
      console.log('exits');
    }
    
    editState.set(null);
    
    Meteor.call('unit.new', {
      _id: t.data.data._id,
      section: currentSection.get(),
      name: name
    }, function(err, succ){
      console.log(err, succ);
    })
    
    console.log(name);
    
  }
}

Template.editAside.rendered = function(){
  // new Sortable(this.find('.sortable.sections')); 
  
}

Template.editAside.helpers({
  getSections: function(){
    var c = Courses.findOne();
    if( !this.data ) return c && c.sections || [];
    return this.data.sections;
    // return _.map(this.data.sections, function( o, i ){
    //   o.index = i;
    //   return o;
    // });
  },
  getName: function(){
    var c = Courses.findOne();
    if( !this.data ) return c && c.name || 'Project'; 
    return this.data.name;
  },
  isSection: function( o ){
    if( !currentSection.get() && o && o.section ) currentSection.set( o.section );
    return this.name == currentSection.get();
  },
  editState: function( type ){
    return editState.get() === type;
  },
  isSectionActive: function(data){
    return this.name == currentSection.get()?'active':'';
  }
});

Template.openSection.helpers({
  isLectureActive: function(data){
    return (data && this.name == data.lecture)?'active':'';
  },
  editState: function( type ){
    return editState.get() === type;
  },
});
