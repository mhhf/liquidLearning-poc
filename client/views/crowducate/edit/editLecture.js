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
  eddy = editor;
}

Template.editLecture.helpers({
  editorDep: function(){
    Editor = editor.val;
    return editor;
  }
});

Template.editLecture.events = {
  "submit #llmdForm": function(e,t){
    var array = $('form').serializeArray();
    e.preventDefault();
    
    
    
    // var course = new CourseModel( t.data.data._id );
    // 
    // Meteor.call('saveLectureFile', course.ele._id, {
    //   commitMsg: 'change',
    //   md: val,
    //   filepath: t.data.lecture + '.llmd'
    // }, function(err, succ){
    //   if( !err ) {
    //     $('button.save-btn').removeClass('changed');
    //   }
    // });
    
  }
};
