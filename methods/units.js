var compileAST = function( _id ){
  
  var atom = Atoms.findOne({ _id: _id });
  
  if( atom.name == 'seq' ) {
    return _.map(atom.data, function(atom_id){ return compileAST( atom_id ) });
  } else if( LLMD.packageTypes[atom.name] && LLMD.packageTypes[atom.name].nested ) {
    var nested = LLMD.packageTypes[atom.name].nested;
    
    nested.forEach( function(k){
      atom[k] = compileAST( atom[k] );
    });
    
    return atom;
  } else {
    return atom;
  }
  
}


Meteor.methods({
  "unit.compile": function( _id ){
    var rootId = Commits.findOne({ _id: _id }).rootId
  
    
    var ast = compileAST( rootId )
  
    return ast;
  
  }
});
