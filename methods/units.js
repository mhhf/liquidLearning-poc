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


var diffAtom = function( _id1, _id2 ) {
  var a1 = Atoms.findOne({ _id: _id1 });
  var a2 = Atoms.findOne({ _id: _id2 });
  
  if( a1._id == a2._id ) { // if the atom has not changed
    return _id1;
  } else if( a1.name == a2.name && a1.name == 'seq' ){ // if both are sequences
    
  } else if( a1.name == a2.name ) { // if atom has changed
    var diffAtom = Atoms.insert({
      name: 'diff',
      type: 'change',
      orig: _id1,
      remote: _id2
    });
    return diffAtom;
  } else { // diffAtom tries to compare 2 different atoms
    throw new Error('type '+a1.name+' and '+a2.name+' mismatch');
  }
  
}


Meteor.methods({
  "unit.compile": function( _id ){
    var rootId = Commits.findOne({ _id: _id }).rootId
  
    
    var ast = compileAST( rootId )
  
    return ast;
  
  },
  "commit.diff": function( _idOld, _idNew ){
    var commitOld = Commits.findOne({ _id: _idOld });
    var commitNew = Commits.findOne({ _id: _idNew });
    
    var commitsQue = [];
    
    while( commitNew && commitNew.previous != commitOld._id ){
      commitsQue.push( commitNew );
      commitNew = Commits.findOne({ _id: commitNew.previous });
    }
    
    if ( commitNew && commitNew.previous == commitOld._id ) {
      commitsQue.push( commitNew );
      commitsQue.push( commitOld );
      
      
      var diff = buildDiff( _.pluck( commitsQue.reverse(), 'rootId' ) );
      console.log(diff);
      // console.log( commitsQue );
      
      
    } else {
      
      console.log( commitsQue );
      console.log('cannot compare unrelated commits');
      
    }
    
    
    // var diffedCommit = diffAtom( commit1.rootId, commit2.rootId );
    // 
    
  }
});



var Diff = function( seq ){
  this._seq = seq;
  
  this.getValidIndex = function(i){
    for( var j=0; j<this._seq.length; j++ ){
      if( typeof this._seq == 'string' || this._seq.type != 'remove' ) {
        if( i-- == 0 ) return j;
      } 
    }
    return this._seq.length;
  }
  
  this.getId = function( i, type ){
    if( this._seq[i] === undefined ) return undefined;
    if( typeof this._seq[i] == 'string' ) return this._seq[i];
    else return this._seq[i][type];
  }
  
  this.getNextId = function( i ){
    return this.getId( this.getValidIndex(i), 'new' );
  }
  
  this.remote = function( i ){
    var index = this.getValidIndex( i );
    this._seq[index] = {
      name: 'diff',
      type: 'remove',
      old: this.getId( index, 'old' ),
      new: ''
    }
  }
  
  this.add = function( i, a ){
    var index = this.getValidIndex( i );
    var diffAtom = {
      name: 'diff',
      type: 'add',
      old: '',
      new: a
    };
    this._seq.splice(index, 0, diffAtom);
  }
  
  this.change = function( i, a ){
    var index = this.getValidIndex( i );
    if( typeof this._seq[index] == 'string' ) {
      var diffAtom = {
        name: 'diff',
        type: 'change',
        old: this._seq[index],
        new: a
      };
    } else {
      var diffAtom = this._seq[index];
      diffAtom['new'] = a;
    }
    this._seq[index] = diffAtom;
  }
}

buildDiff = function( ids ) { 
  
  // seq
  as = _.map( ids, function( a ){ return Atoms.findOne( a ); });
  
  var diff = new Diff(as[0].data);
  
  for(  var i=1; i < as.length; i++ ) {
    
    var seq = as[i].data; // new Sequence
    
    for( var j=0; j < seq.length; j++ ) {
      
      var na = seq[j]; // new Atom ID
      var oa = diff.getNextId( j ); // old Atom ID
      
      if( na == oa ) { // old atom is new atom
        // do nothing
      } else if( na === undefined || diff.getNextId( j+1 ) == na ) { // last element or removed and next is the old one
        // removed
        diff.remove(j);
      } else if( oa === undefined ||  j+1 in seq && seq[j+1] == oa ) {
        diff.add(j, na);
      } else if( ( !(j+1 in seq ) && !( diff.getNextId(j+1) ) ) || ( ( (j+1 in seq ) && ( diff.getNextId(j+1) ) ) && seq[i+1] == diff.getNextId( j+1 ) ) ) // both last or next elements are the same
      // change
      // 
      diff.change( j, na );
    }
    
  }
  
  return diff._seq;
  
  
  
};



// test data:
// 

diff = function( as, bs ){
  var r = [];
  var length = a.length;
  
  
  for( var i=0; i<length; i++ ) {
    var a = as.pop();
    
    if( b.length > 0 ) { 
      var b = bs.pop();
      
  //     if( a == b ) {  // a didn't change
  //       r.push( a );
  //     } else if( bs.indexOf( a ) >= 0 ) { 
  //       r.push({
  //         name: 'diff',
  //         type: 'add',
  //         orig: '',
  //         remote: b
  //       });
  //       for( var j=0; j<bs.indexOf( a ); j++ ) {
  //         b = bs.pop();
  //         r.push({
  //           name: 'diff',
  //           type: 'add',
  //           orig: '',
  //           remote: b
  //         });
  //       }
  //     } else {
  //       // possibly:
  //       // * its the same atom but changed 
  //       // * this atom was removed
  //     }
  //     
  //       
    } else { // a was removed
      r.push({
        name: 'diff',
        type: 'remove',
        orig: a,
        remote: ''
      });
    }
    
  }
}
