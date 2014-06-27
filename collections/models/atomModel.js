var atomModelMap = {};

AtomModel = function( _id, o ){
  
  // singleton
  if( atomModelMap[ _id ] ) return atomModelMap[ _id ];
  atomModelMap[_id] = this;
  
  if( o && o.parent ) this.parent = o.parent; 
  
  
  
  var atom = Atoms.findOne({ _id: _id });
  var nested;
  
  if( LLMD.Package(atom.name).nested ) {
    nested = {};
    var self = this;
    
    LLMD.eachNested( atom, function(seq, key){
      nested[key] = [];
      
      for( var i in seq ){
        var child = new AtomModel(seq[i], {
          parent: self
        });
        nested[key][i] = child;
      }
      
    });
    
    // [TODO] - fill nested with atomModels
    
  }
  
  // this.atom = Atoms.findOne({ _id: _id });
  // 
  
  if( _id && !atom ) throw new Error('no Atom '+_id+' found, maybe its not subscribed to it or is removed.');
  
  
  this.get = function(){
    return atom;
  }
  
  this.getNested = function( k ){
    return nested && nested[k];
  }
  
  this.getId = function(){
    return atom._id;
  }
  
  /**
   * change( <object> )
   * 
   * 
   */
  this.update = function( atomO ){
    
    
    if( !atom.meta.lock ) {
      Atoms.update({ _id: atom._id }, { $set: _.omit( atomO, '_id' ) });
      atom = Atoms.findOne({ _id: atom._id });
      this.emit('change.soft', null);
      // trigger soft change
    } else {
      console.log('updating hard', !!this.parent);
      atom.meta.lock = false;
      var _oldId = atom._id;
      var _atomId = Atoms.insert( _.omit( _.extend(atom, atomO), '_id' ) );
      atom = Atoms.findOne({ _id: _atomId });
      atomModelMap[ _atomId ] = this;
      this.emit('change.hard',{
        _oldId: _oldId,
        _newId: _atomId
      });
      
      this.parent && this.parent.exchangeChildren( _oldId, _atomId );
      // trigger hard change
    }
    
    this.emit('change', null);
    
  }
  
  
  this.getNestedPos = function( _atomId ){
    
    var p;
    var k;
    
    console.log('start looking in', atom);
    LLMD.eachNested( atom, function(seq, key){
      
      for(var i in seq) {
        console.log(seq[i], _atomId, key);
        
        
        if( seq[i] == _atomId ) {
          k = key;
          p = i;
        }
        
      }
    
    });
    
    
    if( p ) {
      return { key: k, pos: p };
    } else {
      return null;
    }
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
  this.addAfter = function( key, atomO, pos ){
    
    if( !( this.isNested() ) ) {
      throw new Error( 'atom '+atom.name+ ' is not nested or nested key isn\'t '+key);
    }
    
    var _atomId = Atoms.insert( atomO );
    
    if( !( pos && pos >= 0 && pos in atom[key] ) ) {
      pos = atom[key].length;
    }
    atom[key].splice( pos, 0, _atomId );
    var o = {};
    o[key] = atom[key];
    
    this.update(o);
    
    var atomModel = new AtomModel( _atomId, {
      parent: this
    } );
    
    this.emit('add', { target: atomModel });
    
    return atomModel;
    
  }
  
  
  // [TODO] - refactor hasChildren
  this.isNested = function(k){
    return !!nested;
  }
  
  this.isLocked = function(){
    return atom.meta.lock;
  }
  
  // [TODO] - refactor: eachChildren
  this.eachNested = function( f ){
    if( this.isNested() ) {
      LLMD.eachNested(atom, f);
    }
  }
  
  // [TODO] - test
  this.eachChildren = function( f ){
    
    this.eachNested( function( seq, key ){
      
      for(var i in seq) {
        f( atomModelMap[seq[i]], key, i );
      }
      
    });
    
  }
  
  // @return: AtomModel
  this.getChild = function( key, pos ){
    if( this.isNested() ) {
      return atom[key][pos];
    }
  }
  
  // [TODO] - refactor: replaceChild
  this.exchangeChildAt = function( key, pos, _atomId ){
    var obj = {};
    obj[key] = atom[key];
    obj[key][pos] = _atomId;
    
    this.update( obj );
  }
  
  this.exchangeChildren = function( _oldId, _newId ){
    
    var pos = this.getNestedPos( _oldId );
    if( pos ) this.exchangeChildAt( pos.key, pos.pos, _newId )
    
  }
  
  this.removeAt = function( key, pos ){
    var obj = {};
    obj[key] = atom[key];
    var _atomId = obj[key].splice(pos, 1);
    
    this.update( obj );
    
    atomModelMap[ _atomId ].emit('remove');
    
  }
  
  this.removeChild = function( _id ){
    var pos = this.getNestedPos( _id );
    if( pos ) this.removeAt( pos.key, pos.pos );
  }
  
  this.remove = function(){
    this.parent.removeChild( atom._id );
  }
  
  this.lock = function(){
    this.update({meta:{lock: true}});
  }
  
  
}

_.extend( AtomModel.prototype, EventEmitter.prototype );
