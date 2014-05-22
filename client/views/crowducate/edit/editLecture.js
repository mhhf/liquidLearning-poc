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

Template.editLecture.rendered = function(){
  
}

Template.editLecture.helpers({
  editorDep: function(){
    Editor = editor.val;
    return editor;
  }
});

Template.editLecture.events = {
  "click button.save-btn": function(e,t){
    e.preventDefault();
    
    var val = editor.get().getValue();
    
    var course = new CourseModel( t.data.data._id );
    
    Meteor.call('saveLectureFile', course.ele._id, {
      commitMsg: 'change',
      md: val,
      filepath: t.data.lecture + '.llmd'
    }, function(err, succ){
      if( !err ) {
        $('button.save-btn').removeClass('changed');
      }
    });
    
  },
  "click button.tts-btn": function(e,t){
    e.preventDefault();
    editor.get().replaceSelection('\n{{#???}}\n\n{{/???}}');
  },
  "click button.ms-btn": function(e,t){
    e.preventDefault();
    var lastLine = editor.get().lastLine();
    var d = document.createElement('div');
    d.className = 'ms-display';
    d.appendChild( document.createElement('textarea') );
    editor.get().addLineWidget(lastLine, d);
  }
};
