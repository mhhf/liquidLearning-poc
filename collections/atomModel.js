AtomModel = function( _id ){
  
  this.atom = Atoms.findOne({ _id: _id });
  if( _id && !this.atom ) throw new Error('no Atom '+_id+' found, maybe its not subscribed to it or is removed.');
  
  
  
  /**
   * change( <Atom> )
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
      var _atomId = Atoms.insert( _.omit( _.extend(this.atom, atom), '_id' ) );
      this.atom = Atoms.findOne({ _id: _atomId });
      this.emit('change.hard', null);
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
  
  
  this.removePos = function(){
    
  }
  
  
}

_.extend( AtomModel.prototype, EventEmitter.prototype );
