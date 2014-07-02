var commitMap = {};
CommitModel = function( _id ){
  
  if( commitMap[_id] ) {
    return commitMap[_id];
  } else {
    commitMap[_id] = this;
  }
  
  if( !_id ) { // insert
    
    var _id = Commits.insert({});
    
  }
  
  
  var commit = Commits.findOne({ _id: _id });
  var root = new AtomModel( commit._rootId );
  
  root.on('change.hard', function( o ){
    Commits.update({ _id: commit._id }, { _rootId: o._newId });
  });
  
  
  this.commit = function( o ){
    
    Commits.update({ _id: commit._id }, { $set: o });
    
    root.eachDescendant( function( a ){
      a.lock();
    });
    root.lock();
    
    var _cId = Commits.insert({
      _rootId: root.getId(),
      parent: commit._rootId,
      _seedId: commit._seedId
    });
    
    // commit = Commits.findOne( { _id: _cId } );
    
    this.emit('commit', _cId );
    
    return new CommitModel( _cId );
  }
  
  this.diff = function( _id ){
    // create diff on this stage with remove _id
  }
  
  this.getRoot = function(){
    return root;
  }
  
  this.getCommit = function(){
    return commit;
  }
  
  this.getId = function(){
    return _id;
  }
  
  
  
  
  
}
_.extend( CommitModel.prototype, EventEmitter.prototype );
