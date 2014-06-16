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

CommitModel = function( o ){
  
  if( o._branchId ) {
    this.branch = LQTags.findOne({ _id: o._branchId });
    this.ele = Commits.findOne({ _id: this.branch._commitId });
  } else if( o._commitId ) {
    this.ele = Commits.findOne({ _id: o._commitId });
  }
  
  // [TODO] - refactor for all nested
  // [TODO] - hashsum the id to link to same atoms in the db - garbage collection is then 'nichtig'
  this.exchange = function( newId, ids ){
    
    if( ids.length <= 1 ) return newId;
    
    var oldId  = ids.pop();
    if( oldId == newId ) {
      return ids[0];
    }
    var parentId = ids.pop();
    
    var oldAtom = Atoms.findOne({_id: parentId});
    
    console.log('o', oldAtom.name);
    
    if( oldAtom.name == 'seq' ) {
      
      var index = oldAtom.data.indexOf( oldId );
      if( index == -1 ) console.log( 'fuuuuuck' );
      
      oldAtom.data[index] = newId;
      
    } else {
      LLMD.Type( oldAtom.name ).nested.forEach( function( e ){
        if( oldAtom[e] == oldId ) oldAtom[e] = newId;
      });
    }
    
    
    ids.push(parentId);
    
    if( typeof oldAtom.meta.commit == "string" ) {
      oldAtom.meta = _.omit(oldAtom.meta,'commit');
      return this.exchange( Atoms.insert(_.omit(oldAtom,'_id')), ids );
    } else {
      var _id = oldAtom._id;
      Atoms.update({_id: oldAtom._id}, {$set: _.omit(oldAtom,'_id') });
      return _id;
    }
    
    
  }
  
  this.add = function( atom, ids ){
    var atomId = Atoms.insert(atom);
    // Meteor.call( 'atom.compile', atomId );
    
    var parentId = ids.pop();
    ids.push( parentId );
    
    var oldAtom = Atoms.findOne( {_id: parentId} );
    
    oldAtom.data.push( atomId );
    // oldAtom.meta.parents.push( oldAtom. );
    
    return this.change(oldAtom, ids);
    
  }
  
  this.change = function( atom, ids ){
    var atomId;
    if( typeof atom.meta.commit == 'string' ) {
      console.log('inserting');
      atom.meta = _.omit(atom.meta,'commit');
      atomId = Atoms.insert(_.omit(atom,'_id'));
      Meteor.call( 'atom.compile', atomId );
    } else {
      console.log('updating');
      Atoms.update({ _id: atom._id }, { $set: _.omit( atom, '_id' ) });
      Meteor.call( 'atom.compile', atom._id );
      atomId = atom._id;
    }
    var _newRootId = this.exchange( atomId, ids );
    
    var root = Atoms.findOne( { _id: _newRootId } );
    
    if( this.ele._rootId != _newRootId ) {
      
      console.log('nr',root);
      // Commits.update( this.ele._id, {$set: {_rootId: _newRootId} } );
      
      var _commitId = Commits.insert({ _rootId: _newRootId, parent: this.ele._id });
      this.ele = Commits.findOne({_id: _commitId });
      this.updateBranch( _commitId );
    }
    
    
    
    
    
    return this.ele._id
    // return newCommit;
    
  }
  
  this.remove = function( ids ){
    var toRemoveId = ids.pop();
    var removeFromSeqId = ids.pop();
    ids.push(removeFromSeqId);
    
    var parentAtom = Atoms.findOne({ _id: removeFromSeqId });
    var index = parentAtom.data.indexOf( toRemoveId );
    
    parentAtom.data.splice(index,1);
    
    return this.change( parentAtom, ids );
    
  }
  
  this.updateBranch = function( newCommitId ){
    if( this.branch ) {
      LQTags.update({ _id: this.branch._id }, {$set: { _commitId: newCommitId }})
    }
  }
  
  this.commit = function( commitO ){
    
    var atom = this.ele._rootId;
    var _commitId = this.ele._id;
    
    Commits.update({ _id: this.ele._id }, { $set: commitO });
      
    this.eachAtom( atom, function( a ) {
      if( !a.meta.commit ) {
        Atoms.update( {_id: a._id}, {$set: {'meta.commit': _commitId } } )
      }
    });
    
  }
  
  this.eachAtom = function( _rootId, cb ){
    
    var self = this;
    var atom = Atoms.findOne({ _id: _rootId });
    cb( atom );
    
    if( atom.name == 'seq' ) {
      atom.data.forEach( function( a ){
        self.eachAtom( a, cb );
      });
    } else if( LLMD.Type( atom.name ).nested && LLMD.Type( atom.name ).nested.length > 0 ){
     
      LLMD.Type( atom.name ).nested.forEach( function(key){
        self.eachAtom( atom[key], cb );
      });
    
    }
    
  }
  
}


// LQTags.update({_id: Units.findOne({name:'rasputin4'}).branch._id }, {$set: {_commitId: Commits.findOne({_id: LQTags.findOne({ _id: Units.findOne({name:'rasputin4'}).branch._id })._commitId }).parent }});
