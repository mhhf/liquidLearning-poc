Meteor.methods({
  newUnit: function( o ){
    var course = new CourseModel( o._id );
    
    course.check('write');
    
    var sections = _.map(course.ele.sections, function(section){
      if( section.name === o.section ) {
        var index = section.units.length;
        section.units.push( { name: o.name, index: index } );
        console.log(section.units);
        return section;
      } else {
        return section;
      }
    });
    
    Courses.update({_id: o._id }, {$set: { sections: sections }});
    
  
  }
});
