var asts = {
  dep:	new Deps.Dependency,
  val: [],
  get: function(){
    this.dep.depend();
    return this.val;
  },
  set: function( val ){
    this.dep.changed();
    this.val = val;
  },
  push: function( o ){
    this.val.push(o);
    this.dep.changed();
  }
}

Template.editLecture.rendered = function(){
}

Template.editLecture.helpers({
  asts: function(){
    return asts;
  } 
});

Template.editLecture.events = {
  "submit #llmdForm": function(e,t){
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
