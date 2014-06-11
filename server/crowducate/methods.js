Meteor.methods({
  'unit.new': function( o ){
    var course = new CourseModel( o._id );
    
    
    var old = _.find( _.pluck( _.flatten( _.pluck(course.ele.sections,'units') ), 'name' ), function( name ){
      return name === o.name;
    });
    
    if( old ) {
      console.log('old found');
      return false;
    } 
    
    
    course.check('write');
    // course.commit( 'init file', '', o.name+'.llmd' );
    // 
    
    var root = new LLMD.packageTypes.seq.skeleton();
    var rootId = Atoms.insert( root );
    
    var commitId = Commits.insert({
      rootId: rootId,
      previous: null
    });
    
    var _unitId = Units.insert({ 
      name: o.name, 
      memberOf: [ course.ele._id ],
      commitId: commitId
    });
    
    var sections = _.map(course.ele.sections, function(section){
      if( section.name === o.section ) {
        var index = section.units.length + 1 ;
        section.units.push( { name: o.name, index: index, _id: _unitId } );
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
  "atom.compile": function( _id ){
    var atom = Atoms.findOne({ _id: _id});
    
    if( LLMD.packageTypes[atom.name] && LLMD.packageTypes[atom.name].preprocess ) {
      var syncPreprocess = Meteor._wrapAsync( LLMD.packageTypes[atom.name].preprocess );
      
      var atom = syncPreprocess( atom );
      
    }
    
    var obj = _.omit( atom, '_id' );
    // if( !obj.meta ) obj.meta = {};
    obj.meta.state = 'ready';
    
    Atoms.update({ _id: atom._id },{ $set: obj });
    
    return atom;
  }
  
});
