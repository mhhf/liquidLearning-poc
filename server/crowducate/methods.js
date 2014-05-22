Meteor.methods({
  newUnit: function( o ){
    var course = new CourseModel( o._id );
    
    
    var old = _.find( _.pluck( _.flatten( _.pluck(course.ele.sections,'units') ), 'name' ), function( name ){
      return name === o.name;
    });
    
    if( old ) {
      console.log('old found');
      return false;
    } 
    
    
    course.check('write');
    course.commit( 'init file', '', o.name+'.llmd' );
    
    
    var sections = _.map(course.ele.sections, function(section){
      if( section.name === o.section ) {
        var index = section.units.length + 1 ;
        section.units.push( { name: o.name, index: index } );
        console.log(section.units);
        return section;
      } else {
        return section;
      }
    });
    
    Courses.update({_id: o._id }, {$set: { sections: sections }});
    
  
  },
  newCourse: function( o ){
    var _id = Courses.insert(o);
    var course = new CourseModel( _id );
    course.log('save','new course created');
    
  },
  openLectureFile: function(_id, name){
    var course = new CourseModel( _id );
    
    course.check('read');
    
    return course.openFile( name + '.llmd' );
    
  },
  saveLectureFile: function(_id, o){
    
    var course = new CourseModel( _id );
    course.check('write');
    course.commit( o.commitMsg, o.md, o.filepath );
    course.log('save', o.commitMsg );
    
  }
  
  
});
