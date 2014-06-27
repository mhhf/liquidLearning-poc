var atomModelMap = {};

AtomModel = function( _id ){
  
  // singleton
  if( atomModelMap[ _id ] ) return atomModelMap[ _id ];
  atomModelMap[_id] = this;
  
  
  this.atom = Atoms.findOne({ _id: _id });
  if( _id && !this.atom ) throw new Error('no Atom '+_id+' found, maybe its not subscribed to it or is removed.');
  
  
  
  /**
   * change( <object> )
   * 
   * 
   */
  this.update = function( atom ){
    
    
    if( !this.atom.meta.lock ) {
      Atoms.update({ _id: this.atom._id }, { $set: _.omit( atom, '_id' ) });
      this.atom = Atoms.findOne({ _id: this.atom._id });
      this.emit('change.soft', null);
      // trigger soft change
    } else {
      this.atom.meta.lock = false;
      var _oldId = this.atom._id;
      var _atomId = Atoms.insert( _.omit( _.extend(this.atom, atom), '_id' ) );
      this.atom = Atoms.findOne({ _id: _atomId });
      atomModelMap[ _atomId ] = this;
      this.emit('change.hard',{
        _oldId: _oldId,
        _newId: _atomId
      });
      // trigger hard change
    }
    
    this.emit('change', null);
    
  }
  
  /**
   * @param key: nested sequence property
   * @param atom: the atom Object
   * @param pos: position in the nested sequence
   * 
   * addAfter( <key>, <Atom> [, <position> ] )
   * 
   * @return: AtomModel
   */
  this.addAfter = function( key, atom, pos ){
    
    if( !( LLMD.hasNested( this.atom ) && LLMD.Package( this.atom.name ).nested.indexOf(key) > -1 ) ) {
      throw new Error( 'atom '+this.atom.name+ ' is not nested or nested key isn\'t '+key);
    }
    
    var _atomId = Atoms.insert( atom );
    
    if( !( pos && pos >= 0 && pos in this.atom[key] ) ) {
      pos = this.atom[key].length;
    }
    this.atom[key].splice( pos, 0, _atomId );
    var o = {};
    o[key] = this.atom[key];
    
    this.update(o);
    
    return new AtomModel( _atomId );
    
  }
  
  
  this.removePos = function( key, pos ){
    
    // remove
    
  }
  
  // [TODO] - refactor hasChildren
  this.isNested = function(){
    return LLMD.hasNested( this.atom );
  }
  
  this.isLocked = function(){
    return this.atom.meta.lock;
  }
  
  // [TODO] - refactor: eachChildren
  this.eachNested = function( f ){
    if( this.isNested() ) {
      LLMD.eachNested(this.atom, f);
    }
  }
  
  this.getChild = function( key, pos ){
    if( this.isNested() ) {
      return this.atom[key][pos];
    }
  }
  
  // [TODO] - refactor: replaceChild
  this.exchangeChild = function( key, pos, _atomId ){
    var obj = {};
    obj[key] = this.atom[key];
    obj[key][pos] = _atomId;
    
    this.update( obj );
  }
  
  this.remove = function( key, pos ){
    var obj = {};
    obj[key] = this.atom[key];
    obj[key].splice(pos, 1);
    
    this.update( obj );
    
  }
  
  this.lock = function(){
    this.update({meta:{lock: true}});
  }
  
  
}

_.extend( AtomModel.prototype, EventEmitter.prototype );
