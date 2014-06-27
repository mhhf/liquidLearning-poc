describe("Tree", function() {
  
  
  it("should be created without an atom", function() {
    
    var tree = new TreeModel();
    
    tree.should.be.a('object');
    
  });
  
  it("should be created from id", function() {
    
    var a = new LLMD.Atom('md');
    
    var _atomId = Atoms.insert( a );
    var tree = new TreeModel( _atomId );
    
    tree.should.be.a('object')
    .and.have.deep.property('root.atom.name','md');
  
    Atoms.remove({ _id: _atomId });
    
  });
  
  it('should build nested elements into a tree', function(){
    
    var _atomId1 = Atoms.insert( new LLMD.Atom('seq') );
    var a1 = new AtomModel( _atomId1 );
    
    a1.addAfter('data', new LLMD.Atom('md') );
    
    var tree = new TreeModel( _atomId1 );
    
    tree.should.have.deep.property('root.atom.data[0].atom.name','md');
    
  });
  
  it('should return an AtomModel for a given _atomId', function(){
    
    var _atomId1 = Atoms.insert( new LLMD.Atom('seq') );
    var a1 = new AtomModel( _atomId1 );
    
    var a2 = a1.addAfter('data', new LLMD.Atom('md') );
    var _atomId2 = a2.atom._id;
    
    var tree = new TreeModel( _atomId1 );
    
    var m11 = tree.getAtomModel( _atomId1 );
    var m12 = tree.getAtomModel( _atomId1 );
    
    m11.should.equal(m12);
    
    var m21 = tree.getAtomModel( _atomId2 );
    var m22 = tree.getAtomModel( _atomId2 );
    
    m21.should.equal( m22 );
    
  });
  
  it('should export ast tree', function(){
    
    var _atomId1 = Atoms.insert( new LLMD.Atom('seq') );
    var a1 = new AtomModel( _atomId1 );
    
    var ifAtom = a1.addAfter('data', new LLMD.Atom('if') );
    ifAtom.addAfter('t', new LLMD.Atom('md') );
    
    var tree = new TreeModel( a1.atom._id );
    
    var ast = tree.export();
    
    ast.should.have.deep.property('data[0].t[0].name','md');
    
  });
  
  it('should import ast tree', function(){
    
    var tree = new TreeModel();
    tree.import({"data":[{"c":"true","f":[],"name":"if","t":[{"name":"md","data":""}]}],"name":"seq"});
    
    tree.root.atom.should.have.deep.property('data[0].atom.t[0].atom.name','md');
    tree.root.atom.should.have.property('_id')
    .and.be.a('string');
    
  });
  
  it('should perserve locked structure', function(){
    
    var _atomId1 = Atoms.insert( new LLMD.Atom('seq') );
    var a1 = new AtomModel( _atomId1 );
    
    var __ifAtom = a1.addAfter('data', new LLMD.Atom('if') );
    var _ifId = __ifAtom.atom._id;
    var __mdAtom = __ifAtom.addAfter('t', new LLMD.Atom('md') );
    var _mdId = __mdAtom.atom._id;
    var _a1Id = a1.atom._id;
    
    __ifAtom.lock();
    __mdAtom.lock();
    
    var tree = new TreeModel( a1.atom._id );
    
    var mdAtom = tree.getAtomModel( _mdId );
    var ifAtom = tree.getAtomModel( _ifId );
    
    mdAtom.update({data:'1'});
    
    ifAtom.isLocked().should.be.false;
    ifAtom.atom._id.should.not.equal( _ifId );
    a1.atom._id.should.equal( _a1Id );
    
  });
  
  it('should update the id map', function(){
    
    var _a = Atoms.insert( new LLMD.Atom('seq') );
    var a1 = new AtomModel( _a );
    
    var atom1 = a1.addAfter('data', new LLMD.Atom('md') );
    var _atomId1 = atom1.atom._id;
    
    
    var tree = new TreeModel( _a );
    tree.getAtomModel( _atomId1 ).should.equal( atom1 );
    
    var a = tree.getAtomModel( _atomId1 );
    
    
    a.lock();
    a.update({ data: '1' });
    
    var _atomId2 = a.atom._id;
    
    _atomId1.should.not.equal( _atomId2 );
    
    
    console.log( tree.getAtomModel( _atomId1 ) );
    
    tree.getAtomModel( _atomId2 ).should.equal( a );
    
    
    
  });
  
  it('should update modelMap if atom is added', function(){
    
    var _a = Atoms.insert( new LLMD.Atom('seq') );
    var a1 = new AtomModel( _a );
    
    var ifModel = a1.addAfter('data', new LLMD.Atom('if'));
    
    var tree = new TreeModel( a1.atom._id );
    
    var newAtom = ifModel.addAfter('t', new LLMD.Atom('md'));
    
    var newAtom2 = tree.getAtomModel( newAtom.getId() );
    
    newAtom.should.equal( newAtom2 );
    
    
  });
  
  
  
  
  // should trigger __change.root__ if ___rootId__ has changed
  
  
  
});
