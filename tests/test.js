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
        a2.atom.meta.lock.should.equal( true );
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
        
        a2.on('change.hard', function(){
          done();
        });
        
        a2.update({ data: '6' });
        
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
      
    })
    
    // should have change __atom__ function
    // should have remove __key__ __pos__ function
    // should have remove ___atomId__ function
    // should have isNested function
    // should have eachNested function
    // should have onChanged callback
    
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
    .and.have.deep.property('ast.name','md');
  
    Atoms.remove({ _id: _atomId });
    
  });
  
  it('should build nested elements into a tree', function(){
    
    var s = new LLMD.Atom('seq');
    var _atomId = Atoms.insert( s );
    
    
    
  });
  
  
  
  
});


checkDefaultAtomValues = function( a, name ){
  a.should.have.property('_seedId').and.to.be.a('string');
  a.should.have.property('meta').and.to.be.a('object');
  a.should.have.property('name').and.to.equal( name );
}
