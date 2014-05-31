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
// var model;
Template.editLecture.rendered = function(){
  // model = new ASTModel({ _id: this.data.unit._id });
}

Template.editLecture.helpers({
  asts: function(){
    return asts;
  },
  astModel: function(){
    return new ASTModel({ name: this.unit });
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
