CourseModel = function( _id ){
  
  this.Collection = Courses;
  
  this.ele = this.Collection.findOne( _id );
  
  ACLInterface.apply( this );
  ActivityInterface.apply( this );
  
}

ProjectModel = function( _id ){
  
  this.Collection = Projects;
  
  this.ele = this.Collection.findOne( _id );
  
  ACLInterface.apply( this );
  ActivityInterface.apply( this );
  
  if( Meteor.isServer ) {
    GitInterface.apply( this );
  }
  
}

CommitModel = function( _id ){
  
  this.unit = Units.findOne({ _id: _id });
  this.ele = Commits.findOne({ _id: this.unit.commitId });
  
  // [TODO] - refactor for all nested
  // [TODO] - hashsum the id to link to same atoms in the db - garbage collection is then 'nichtig'
  this.exchange = function( newId, ids ){
    
    if( ids.length <= 1 ) return newId;
    
    var oldId  = ids.pop();
    var parentId = ids.pop();
    
    var oldAtom = Atoms.findOne({_id: parentId});
    
    var index = oldAtom.data.indexOf( oldId );
    if( index == -1 ) console.log( 'fuuuuuck' );
    
    oldAtom.data[index] = newId;
    
    ids.push(parentId);
    
    return this.exchange( Atoms.insert(_.omit(oldAtom,'_id')), ids );
    
  }
  
  this.add = function( atom, ids ){
    var atomId = Atoms.insert(atom);
    
    var parentId = ids.pop();
    ids.push( parentId );
    
    var oldAtom = Atoms.findOne( {_id: parentId} );
    
    oldAtom.data.push( atomId );
    
    
    
    return this.change(_.omit(oldAtom,'_id'), ids);
    
  }
  
  this.change = function( atom, ids ){
    
    var atomId = Atoms.insert(atom);
    var newRootId = this.exchange( atomId, ids );
    
    var newCommit = Commits.insert({ rootId: newRootId, previous: this.ele._id });
    this.ele = Commits.findOne({_id: newCommit});
    
    this.updateUnit( newCommit );
    
    return newCommit;
    
  }
  
  this.remove = function( ids ){
    var toRemoveId = ids.pop();
    var removeFromSeqId = ids.pop();
    ids.push(removeFromSeqId);
    
    var parentAtom = Atoms.findOne({ _id: removeFromSeqId });
    var index = parentAtom.data.indexOf( toRemoveId );
    
    parentAtom.data.splice(index,1);
    
    return this.change( _.omit(parentAtom,'_id'), ids );
    
  }
  
  this.updateUnit = function( newCommitId ){
    Units.update({_id: this.unit._id}, {$set: { commitId: newCommitId }})
  }
  
}
