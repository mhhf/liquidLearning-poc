// assert = chai.assert
chai.should();

describe('Atoms', function(){
  
  describe('#md', function(){
    
    it('should be created properly', function(){
      var a = new LLMD.Atom('md');
      
      checkDefaultAtomValues( a, 'md' );
      
      a.should.have.property('data').and.to.equal('');
      
    });
    
  });
  
  describe('#seq', function(){
    
    it('schould be created properly', function(){
      
      var a = new LLMD.Atom('seq');
      
      checkDefaultAtomValues( a, 'seq' );
      
      a.should.have.property('data').and.to.deep.equal([]);
      
    });
    
  });
  
  describe('Model', function(){
    
    var a1, a2;
    
    beforeEach( function(){
      var _atomId1 = Atoms.insert( new LLMD.Atom('seq') );
      a1 = new AtomModel( _atomId1 );
      
      var _atomId2 = Atoms.insert( new LLMD.Atom('md') );
      a2 = new AtomModel( _atomId2 );
     
    });
    
    it('schould hold the atom', function(){
      
      a1.should.have.property('atom')
      .and.deep.property('name','seq');
      
    });
    
    describe('#update()', function(){
      	
      it('should update the atom', function(){
        var _id = a2.atom._id;
        a2.update({ data: '1' });
        a2.atom.data.should.equal('1');
        a2.atom._id.should.equal( _id );
      });
      
      it('should hard update locked atoms', function(){
        a2.atom.meta.lock = true;
        var _id = a2.atom._id;
        a2.update({ data: '2' });
        a2.atom.data.should.equal('2');
        a2.atom.meta.lock.should.be.false;
        a2.atom._id.should.not.equal( _id );
      });
      
      it('should trigger change callback', function( done ){
        
        a2.on('change', function(){
          done();
        });
        
        a2.update({ data: '4' });
        
      });
      
      it('should trigger soft change callback', function( done ){
        
        a2.on('change.soft', function(){
          done();
        });
        
        a2.update({ data: '5' });
        
      });
      
      it('should trigger hard change callback', function( done ){
        
        a2.atom.meta.lock = true;
        
        a2.on('change.hard', function( atomModel ){
          this.atom.meta.lock.should.be.false;
          done();
        });
        
        a2.update({ data: '6' });
        
      });
      
      it('#isLocked()', function(){
        
        a1.isLocked().should.be.false;
        a1.atom.meta.lock = true;
        a1.isLocked().should.be.true;
        
      });
      
      it('#lock() should lock the atom', function(){
        
        a1.lock();
        a1.isLocked().should.be.true;
        
      });
      
      
    });
    
    describe('#getChild()', function(){
      
      it('should return the child id', function(){
        
        a1.addAfter('data', new LLMD.Atom('md'));
        a1.getChild('data', 0).should.be.a('string');
        
      });
      
    });
    
    describe('#exchangeChild()', function(){
      
      it('should exchange a child on a given key and pos', function(){
        
        a1.addAfter('data', new LLMD.Atom('md') );
        var _atomId = a1.atom._id;
        
        a1.exchangeChild('data',0, a2.atom._id );
        
        a1.atom._id.should.equal( _atomId );
        a1.getChild('data',0).should.eql( a2.atom._id );
        
      });
      	
    });
    
    describe('#addAfter()', function(){
      
      it('should add atom without position', function(){
        
        var atom = new LLMD.Atom('md');
        atom.data = '1';
        var atom2 = a1.addAfter('data', atom );
        
        a1.atom.data[0].should.be.a('string');
        atom2.atom.name.should.eql('md'); 
        
      });
      
      it('should add atom after position', function(){
        
        var atom = new LLMD.Atom('md');
        atom.data = '1';
        var atom1 = a1.addAfter('data', atom );
        
        var atom = new LLMD.Atom('md');
        atom.data = '2';
        var atom2 = a1.addAfter('data', atom, 0 );
        a1.atom.data[1].should.equal( atom2.atom._id );
        
      });
      
      it('should ignore invalid positions', function(){
        
        var atom = new LLMD.Atom('md');
        atom.data = '3';
        a1.addAfter('data', atom, -1 );
        
        var atom = new LLMD.Atom('md');
        atom.data = '4';
        a1.addAfter('data', atom, 100 );
        
      });
      
    });
    
    describe('#remove', function(){
      
      it('should remove __key__ and __pos__', function(){
        
        a1.addAfter('data', new LLMD.Atom('md'));
        a1.remove('data',0);
        a1.atom.data.should.have.length(0);
        
      });
      
      	
    });
    
    it('#isNested()', function(){
      a1.isNested().should.be.true;
      a2.isNested().should.be.false;
    });
    
    it('#eachNested()', function( done ){
      
      a1.addAfter( 'data', new LLMD.Atom('md') );
      a1.eachNested(function( a, k ){
        a.should.be.a('array');
        k.should.eql('data');
        done();
      });
      
    });
    
  });
  
  
})

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
    a1 = new AtomModel( _atomId1 );
    
    a1.addAfter('data', new LLMD.Atom('md') );
    
    var tree = new TreeModel( _atomId1 );
    
    tree.should.have.deep.property('root.atom.data[0].atom.name','md');
    
  });
  
  it('should return an AtomModel for a given _atomId', function(){
    
    var _atomId1 = Atoms.insert( new LLMD.Atom('seq') );
    a1 = new AtomModel( _atomId1 );
    
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
    
    var ifAtom = a1.addAfter('data', new LLMD.Atom('if') );
    ifAtom.addAfter('t', new LLMD.Atom('md') );
    
    var tree = new TreeModel( a1._id );
    
    var ast = tree.export();
    
    ast.should.have.deep.property('data[0].t[0].name','md');
    
    
  });
  
  it('should perserve locked structure', function(){
    
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
  
  // [TODO] - test tree update map
  
  
  //
  // should trigger __change.root__ if ___rootId__ has changed
  
  
  
});


checkDefaultAtomValues = function( a, name ){
  a.should.have.property('_seedId').and.to.be.a('string');
  a.should.have.property('meta').and.to.be.a('object');
  a.should.have.property('name').and.to.equal( name );
}

// [TODO] - atom.add()
