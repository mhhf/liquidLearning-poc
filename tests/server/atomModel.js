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
    
    it('schould hold the atom', function(){
      
      var _atomId1 = Atoms.insert( new LLMD.Atom('seq') );
      var a1 = new AtomModel( _atomId1 );
      
      a1.should.have.property('atom')
      .and.deep.property('name','seq');
      
    });
    
    it('should create one model per id', function(){
      
      var _atomId1 = Atoms.insert( new LLMD.Atom('seq') );
      var a1 = new AtomModel( _atomId1 );
      
      var model1 = new AtomModel( a1.atom._id );
      var model2 = new AtomModel( a1.atom._id );
      
      a1.should.equal( model1 );
      model1.should.equal( model2 );
      
    });
    
    it('#getId() should return the id', function(){
      
      var _atomId1 = Atoms.insert( new LLMD.Atom('seq') );
      var a1 = new AtomModel( _atomId1 );
      
      a1.getId().should.equal( a1.atom._id );
      
    });
    
    describe('#update()', function(){
      	
      it('should update the atom', function(){
        
        var _atomId2 = Atoms.insert( new LLMD.Atom('md') );
        var a2 = new AtomModel( _atomId2 );
        
        var _id = a2.atom._id;
        a2.update({ data: '1' });
        a2.atom.data.should.equal('1');
        a2.atom._id.should.equal( _id );
      });
      
      it('should hard update locked atoms', function(){
        
        var _atomId2 = Atoms.insert( new LLMD.Atom('md') );
        var a2 = new AtomModel( _atomId2 );
        
        a2.atom.meta.lock = true;
        var _id = a2.atom._id;
        a2.update({ data: '2' });
        a2.atom.data.should.equal('2');
        a2.atom.meta.lock.should.be.false;
        a2.atom._id.should.not.equal( _id );
      });
      
      it('should maintan singleton structure on hard change', function(){
        
        var _atomId2 = Atoms.insert( new LLMD.Atom('md') );
        var a2 = new AtomModel( _atomId2 );
        
        var _id = a2.atom._id;
        
        a2.lock();
        a2.update({data:'1'});
        
        var _id2 = a2.atom._id;
        
        var m1 = new AtomModel( _id );
        var m2 = new AtomModel( _id2 );
        
        m1.should.equal( m2 );
        
      });
      
      it('should trigger change callback', function( done ){
        
        var _atomId2 = Atoms.insert( new LLMD.Atom('md') );
        var a2 = new AtomModel( _atomId2 );
        
        a2.on('change', function(){
          done();
        });
        
        a2.update({ data: '4' });
        
      });
      
      it('should trigger soft change callback', function( done ){
        
        var _atomId2 = Atoms.insert( new LLMD.Atom('md') );
        var a2 = new AtomModel( _atomId2 );
        
        a2.on('change.soft', function(){
          done();
        });
        
        a2.update({ data: '5' });
        
      });
      
      it('should trigger hard change callback', function( done ){
        
        var _atomId2 = Atoms.insert( new LLMD.Atom('md') );
        var a2 = new AtomModel( _atomId2 );
        
        a2.atom.meta.lock = true;
        
        a2.on('change.hard', function( atomModel ){
          this.atom.meta.lock.should.be.false;
          done();
        });
        
        a2.update({ data: '6' });
        
      });
      
      it('#isLocked()', function(){
        
        var _atomId2 = Atoms.insert( new LLMD.Atom('md') );
        var a2 = new AtomModel( _atomId2 );
        
        a2.isLocked().should.be.false;
        a2.atom.meta.lock = true;
        a2.isLocked().should.be.true;
        
      });
      
      it('#lock() should lock the atom', function(){
        
        var _atomId2 = Atoms.insert( new LLMD.Atom('md') );
        var a2 = new AtomModel( _atomId2 );
        
        a2.lock();
        a2.isLocked().should.be.true;
        
      });
      
      
    });
    
    describe('#getChild()', function(){
      
      it('should return the child id', function(){
        
        var _atomId1 = Atoms.insert( new LLMD.Atom('seq') );
        var a1 = new AtomModel( _atomId1 );
        
        a1.addAfter('data', new LLMD.Atom('md'));
        a1.getChild('data', 0).should.be.a('string');
        
      });
      
    });
    
    describe('#exchangeChild()', function(){
      
      it('should exchange a child on a given key and pos', function(){
        
        var _atomId1 = Atoms.insert( new LLMD.Atom('seq') );
        var a1 = new AtomModel( _atomId1 );
        
        var _atomId2 = Atoms.insert( new LLMD.Atom('md') );
        var a2 = new AtomModel( _atomId2 );
        
        a1.addAfter('data', new LLMD.Atom('md') );
        var _atomId = a1.atom._id;
        
        a1.exchangeChild('data',0, a2.atom._id );
        
        a1.atom._id.should.equal( _atomId );
        a1.getChild('data',0).should.eql( a2.atom._id );
        
      });
      	
    });
    
    describe('#addAfter()', function(){
      
      it('should add atom without position', function(){
        
        var _atomId1 = Atoms.insert( new LLMD.Atom('seq') );
        var a1 = new AtomModel( _atomId1 );
        
        var atom = new LLMD.Atom('md');
        atom.data = '1';
        var atom2 = a1.addAfter('data', atom );
        
        a1.atom.data[0].should.be.a('string');
        atom2.atom.name.should.eql('md'); 
        
      });
      
      it('should add atom after position', function(){
        
        var _atomId1 = Atoms.insert( new LLMD.Atom('seq') );
        var a1 = new AtomModel( _atomId1 );
        
        var atom = new LLMD.Atom('md');
        atom.data = '1';
        var atom1 = a1.addAfter('data', atom );
        
        var atom = new LLMD.Atom('md');
        atom.data = '2';
        var atom2 = a1.addAfter('data', atom, 0 );
        a1.atom.data[1].should.equal( atom2.atom._id );
        
      });
      
      it('should ignore invalid positions', function(){
        
        var _atomId1 = Atoms.insert( new LLMD.Atom('seq') );
        var a1 = new AtomModel( _atomId1 );
        
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
        
        var _atomId1 = Atoms.insert( new LLMD.Atom('seq') );
        var a1 = new AtomModel( _atomId1 );
        
        a1.addAfter('data', new LLMD.Atom('md'));
        a1.remove('data',0);
        a1.atom.data.should.have.length(0);
        
      });
      
      	
    });
    
    it('#isNested()', function(){
      
      var _atomId1 = Atoms.insert( new LLMD.Atom('seq') );
      var a1 = new AtomModel( _atomId1 );
      
      var _atomId2 = Atoms.insert( new LLMD.Atom('md') );
      var a2 = new AtomModel( _atomId2 );
      
      a1.isNested().should.be.true;
      a2.isNested().should.be.false;
    });
    
    it('#eachNested()', function( done ){
      
      var _atomId1 = Atoms.insert( new LLMD.Atom('seq') );
      var a1 = new AtomModel( _atomId1 );
      
      a1.addAfter( 'data', new LLMD.Atom('md') );
      a1.eachNested(function( a, k ){
        a.should.be.a('array');
        k.should.eql('data');
        done();
      });
      
    });
    
  });
  
});


checkDefaultAtomValues = function( a, name ){
  a.should.have.property('_seedId').and.to.be.a('string');
  a.should.have.property('meta').and.to.be.a('object');
  a.should.have.property('name').and.to.equal( name );
}

// [TODO] - atom.add
