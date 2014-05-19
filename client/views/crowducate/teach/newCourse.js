var editor = {
  dep:	new Deps.Dependency,
  val: '',
  get: function(){
    this.dep.depend();
    return this.val;
  },
  set: function( val ){
    this.dep.changed();
    this.val = val;
  }
}

Template.newCourse.helpers({
  editorDep: function(){
    return editor;
  }
});

Template.newCourse.events = {
  "submit": function(e,t){
    e.preventDefault();
    
    var name = t.find('#name').value;
    var tags = this.newtags || []; 
    var description = editor.get().getValue();
    
    console.log(name);
    console.log(tags);
    console.log(description);
    
  },
}
