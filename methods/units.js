var compileAST = function( _id ){
  
  var atom = Atoms.findOne({ _id: _id });
  
  if( atom.name == 'seq' ) {
    return _.map(atom.data, function(atom_id){ return compileAST( atom_id ) });
  } else if( LLMD.packageTypes[atom.name] && LLMD.packageTypes[atom.name].nested ) {
    var nested = LLMD.packageTypes[atom.name].nested;
    
    nested.forEach( function(k){
      if( atom[k] ) {
        atom[k] = compileAST( atom[k] );
      }
    });
    
    return atom;
  } else {
    return atom;
  }
  
}

// 
// var diffAtom = function( _id1, _id2 ) {
//   var a1 = Atoms.findOne({ _id: _id1 });
//   var a2 = Atoms.findOne({ _id: _id2 });
//   
//   if( a1._id == a2._id ) { // if the atom has not changed
//     return _id1;
//   } else if( a1.name == a2.name && a1.name == 'seq' ){ // if both are sequences
//     
//   } else if( a1.name == a2.name ) { // if atom has changed
//     var diffAtom = Atoms.insert({
//       name: 'diff',
//       type: 'change',
//       orig: _id1,
//       remote: _id2
//     });
//     return diffAtom;
//   } else { // diffAtom tries to compare 2 different atoms
//     throw new Error('type '+a1.name+' and '+a2.name+' mismatch');
//   }
//   
// }


Meteor.methods({
  "unit.compile": function( _id ){
    var rootId = Commits.findOne({ _id: _id }).rootId
  
    
    var ast = compileAST( rootId )
  
    return ast;
  
  },
  "ast.compile": function( _id ){
    var ast = compileAST( _id );
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
      
      console.log();
      
      var seqHistory = _.pluck( commitsQue.reverse(), 'rootId' );
      console.log( 'h', seqHistory);
      
      var diffSeq = seqDiff( seqHistory );
      var newRootSeqId = Atoms.insert({
        name: 'seq',
        data: diffSeq,
        meta: {
          diff: {
            type: 'change',
            parents: seqHistory
          }
        }
      });
      console.log( newRootSeqId );
      // console.log( commitsQue );
      
      
    } else {
      
      console.log( commitsQue );
      console.log('cannot compare unrelated commits');
      
    }
    
    
    // var diffedCommit = diffAtom( commit1.rootId, commit2.rootId );
    // 
    
  }
});



// [TODO] - try to refactor diff: remove old key and replace it with parents
//    parents[0] = old
var Diff = function( seq ){
  this._seq = seq;
  
  this.getValidIndex = function(i){
    for( var j=0; j<this._seq.length; j++ ){
      if( typeof this._seq[j] == 'string' || this._seq[j].meta.diff.type != 'remove' ) {
        if( i-- == 0 ) return j;
      }
    }
    return this._seq.length;
  }
  
  this.getId = function( i, type ){
    if( this._seq[i] === undefined ) return undefined;
    if( typeof this._seq[i] == 'string' ) return this._seq[i];
    else return this._seq[i]._id;
  }
  
  this.getNextId = function( i ){
    return this.getId( this.getValidIndex(i) );
  }
  
  this.remove = function( i ){
    var index = this.getValidIndex( i );
    if( typeof this._seq[index] == 'string' ) {
      var atom = Atoms.findOne({ _id: this._seq[index] });
      atom.meta.diff = {
        type: 'remove',
        parents: []
      }
      this._seq[index] = atom;
    } else {
      this._seq[index].meta.diff.type = 'remove';
    }
  }
  
  this.add = function( i, a ){
    var index = this.getValidIndex( i );
    var diffAtom = Atoms.findOne({ _id: a });
    diffAtom.meta.diff = {
      type: 'add',
      parents: [a]
    };
    this._seq.splice(index, 0, diffAtom);
  }
  
  this.change = function( i, a ){
    var index = this.getValidIndex( i );
    if( typeof this._seq[index] == 'string' ) {
      var diffAtom = Atoms.findOne({ _id: a });
      diffAtom.meta.diff = {
        type: 'change',
        parents: [this._seq[index]]
      }
    } else {
      var diffAtom = Atoms.findOne({ _id: a });
      var oldDiffAtom = this._seq[index];
      diffAtom.meta.diff = {
        type: oldDiffAtom.meta.diff.type,
        parents: oldDiffAtom.meta.diff.parents
      }
      diffAtom.meta.diff.parents.push( oldDiffAtom._id );
    }
    this._seq[index] = diffAtom;
  }
  
  // this.setNew = function(i, a){
  //   if( typeof this._seq[i] == 'string' ) {
  //     this._seq[i] = a;
  //   } else {
  //     this._seq[i]['new'] = a;
  //   }
  // }
  
  this.nest = function( i, key, _id ){
    this._seq[i][key] = _id;
  }
  
  this.forEach = function( cb ){
    this._seq.forEach( function(a, i){
      if( typeof a == 'string' || a.meta.diff.type != 'remove' ) {
        cb(a, i);
      }
    });
  }
}

/**
 *  Generate a sequence diff based on atomic changes
 *  
 *  @param ids: Array of atom id's of the type sequence
 *              ids[0] < ids[n]
 * 
 */
seqDiff = function( ids ) { 
  
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
        console.log(j, oa, na, diff.getValidIndex(j+1), diff._seq);
        // removed
        diff.remove(j);
        break;
      } else if( oa === undefined ||  j+1 in seq && seq[j+1] == oa ) {
        diff.add(j, na);
        break;
      } else if( ( !(j+1 in seq ) && !( diff.getNextId(j+1) ) ) || ( ( (j+1 in seq ) && ( diff.getNextId(j+1) ) ) && seq[j+1] == diff.getNextId( j+1 ) ) ) // both last or next elements are the same
      {
        diff.change( j, na );
        break;
        
      } else {
        throw new Error('this should never get fired');
      }
      
    }
    
  }
  
  // go recursivly and diff nested
  diff.forEach( function( diffAtom, i ){
    
    if( typeof diffAtom != 'string' && diffAtom.meta.diff.type == 'change' ) {
    
      var type = LLMD.packageTypes[diffAtom.name];
      var nested = type && type.nested;
      
      if( nested ) {
        // build history sequence
        // var history = [diffAtom.old].concat( diffAtom.parents );
        // history.push( diffAtom.new );
        // 
        var history = diffAtom.meta.diff.parents;
        history.push(diffAtom._id);
        history.reverse();
        console.log('history',history);
        
        nested.forEach( function( key ){
          // build history sequence of each nested sequences
          
          var seqHistory = [];
          
          history.forEach( function( nodeId ){
            var atom = Atoms.findOne({ _id: nodeId });
            console.log( 'ak ', key ,atom[key] );
            if( seqHistory[ seqHistory.length - 1 ] != atom[key] ) {
              seqHistory.push( atom[key] );
            }
          });
          
          console.log('sq ',seqHistory);
          
          
          if( seqHistory.length > 1 ) {
            
            var newSeqData = seqDiff( seqHistory.reverse() );
            var newSeqAtom = Atoms.insert({
              name: 'seq',
              data: newSeqData,
              meta: {
                diff: {
                  type: 'change',
                  parents: seqHistory
                }
              }
            });
            
            console.log(i,key,newSeqAtom);
            diff.nest(i,key,newSeqAtom)
          }
          
          
        });
        
        // //check if one nested has changed
        // var newAtomId = Atoms.insert( _.omit( newAtom, '_id' ) );
        // diff.setNew( i, newAtomId );
        
      }
    }
    
  });
  
  
  // build diff sequence
  var newSeq = _.map( diff._seq, function( o ){
    if( typeof o == 'string' ) return o;
    return Atoms.insert(_.omit(o,'_id'));
  });
  
  
  return newSeq;
  
};



// test data:
// 

// diff = function( as, bs ){
//   var r = [];
//   var length = a.length;
//   
//   
//   for( var i=0; i<length; i++ ) {
//     var a = as.pop();
//     
//     if( b.length > 0 ) { 
//       var b = bs.pop();
//       
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
//     } else { // a was removed
//       r.push({
//         name: 'diff',
//         type: 'remove',
//         orig: a,
//         remote: ''
//       });
//     }
//     
//   }
// }
