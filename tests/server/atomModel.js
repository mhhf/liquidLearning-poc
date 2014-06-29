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
      
      a1.get().should.have.property('name','seq');
      
      // a1.should.have.property('atom')
      // .and.deep.property('name','seq');
      
    });
    
    it('should create one model per id', function(){
      
      var _atomId1 = Atoms.insert( new LLMD.Atom('seq') );
      var a1 = new AtomModel( _atomId1 );
      
      var model1 = new AtomModel( a1.getId() );
      var model2 = new AtomModel( a1.getId() );
      
      a1.should.equal( model1 );
      model1.should.equal( model2 );
      
    });
    
    
    it('#getId() should return the id', function(){
      
      var _atomId1 = Atoms.insert( new LLMD.Atom('seq') );
      var a1 = new AtomModel( _atomId1 );
      
      a1.getId().should.equal( a1.getId() );
      
    });
    
    describe('#update()', function(){
      	
      it('should update the atom', function(){
        
        var _atomId2 = Atoms.insert( new LLMD.Atom('md') );
        var a2 = new AtomModel( _atomId2 );
        
        var _id = a2.getId();
        a2.update({ data: '1' });
        a2.get().data.should.equal('1');
        a2.getId().should.equal( _id );
      });
      
      it('should hard update locked atoms', function(){
        
        var _atomId2 = Atoms.insert( new LLMD.Atom('md') );
        var a2 = new AtomModel( _atomId2 );
        var _id = a2.getId();
        
        a2.lock();
        a2.update({ data: '2' });
        a2.get().data.should.equal('2');
        a2.isLocked().should.be.false;
        a2.getId().should.not.equal( _id );
        
      });
      
      it('should hard update nested locked atoms', function(){
        
        var _atomId1 = Atoms.insert( new LLMD.Atom('seq') );
        var a1 = new AtomModel( _atomId1 );
        var a2 = a1.addAfter('data', new LLMD.Atom('if'));
        var a3 = a2.addAfter('t', new LLMD.Atom('md'));
        var _id1 = a1.getId();
        var _id2 = a2.getId();
        var _id3 = a3.getId();
        
        a2.lock();
        a3.lock();
        
        a2.isLocked().should.be.true;
        a3.isLocked().should.be.true;
        
        a3.update({ data: '2' });
        
        a3.get().data.should.equal('2');
        
        a2.isLocked().should.be.false;
        a3.isLocked().should.be.false;
        
        a2.getId().should.not.equal( _id2 );
        a3.getId().should.not.equal( _id3 );
        
      });
      
      it('should maintan singleton structure on hard change', function(){
        
        var _atomId2 = Atoms.insert( new LLMD.Atom('md') );
        var a2 = new AtomModel( _atomId2 );
        
        a2.lock();
        a2.update({data:'1'});
        
        var _id2 = a2.getId();
        
        var m2 = new AtomModel( _id2 );
        
        a2.should.equal( m2 );
        
      });
      
      it('should have a model for each _id', function(){
        
        var a = new AtomModel( new LLMD.Atom('md') );
        var _id1 = a.getId();
        a.lock();
        a.update({ data: '1' });
        var b = new AtomModel( _id1 );
        
        a.should.not.equal( b );
        
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
        
        a2.lock();
        
        a2.on('change.hard', function( atomModel ){
          this.isLocked().should.be.false;
          done();
        });
        
        a2.update({ data: '6' });
        
      });
      
      it('#isLocked()', function(){
        
        var _atomId2 = Atoms.insert( new LLMD.Atom('md') );
        var a2 = new AtomModel( _atomId2 );
        
        a2.isLocked().should.be.false;
        a2.lock();
        a2.isLocked().should.be.true;
        
      });
      
      it('#lock() should lock the atom', function(){
        
        var _atomId2 = Atoms.insert( new LLMD.Atom('md') );
        var a2 = new AtomModel( _atomId2 );
        
        a2.lock();
        a2.isLocked().should.be.true;
        
      });
      
      
    });
    
    describe('#getChild', function(){
      
      it('should return the child id', function(){
        
        var _atomId1 = Atoms.insert( new LLMD.Atom('seq') );
        var a1 = new AtomModel( _atomId1 );
        
        a1.addAfter('data', new LLMD.Atom('md'));
        a1.getChild('data', 0).should.be.a('string');
        
      });
      
    });
    
    describe('#exchangeChild', function(){
      
      it('should exchange a child on a given key and pos', function(){
        
        var _atomId1 = Atoms.insert( new LLMD.Atom('seq') );
        var a1 = new AtomModel( _atomId1 );
        
        var _atomId2 = Atoms.insert( new LLMD.Atom('md') );
        var a2 = new AtomModel( _atomId2 );
        
        a1.addAfter('data', new LLMD.Atom('md') );
        var _atomId = a1.getId();
        
        a1.exchangeChildAt('data',0, a2.getId() );
        
        a1.getId().should.equal( _atomId );
        a1.getChild('data',0).should.eql( a2.getId() );
        
      });
      
      it('#exchangeChildren should exchange a child _id for another child _id', function(){
        
        var _atomId1 = Atoms.insert( new LLMD.Atom('seq') );
        var a1 = new AtomModel( _atomId1 );
        
        var a2 = a1.addAfter('data', new LLMD.Atom('md'));
        
        var _atomId = Atoms.insert( new LLMD.Atom('md'));
        
        a1.exchangeChildren( a2.getId(), _atomId );
        
        a1.getChild( 'data', 0 ).should.equal( _atomId );
        
      });
      
      	
    });
    
    describe('#addAfter()', function(){
      
      it('should add atom without position', function(){
        
        var _atomId1 = Atoms.insert( new LLMD.Atom('seq') );
        var a1 = new AtomModel( _atomId1 );
        
        var atom = new LLMD.Atom('md');
        atom.data = '1';
        var atom2 = a1.addAfter('data', atom );
        
        a1.get().data[0].should.be.a('string');
        atom2.get().name.should.eql('md'); 
        
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
        a1.get().data[1].should.equal( atom2.getId() );
        
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
      
      it('#remove() should remove the holding atom', function( done ){
        
        var _atomId1 = Atoms.insert( new LLMD.Atom('seq') );
        var a1 = new AtomModel( _atomId1 );
        var a2 = a1.addAfter('data', new LLMD.Atom('md'));
        var _id2 = a2.getId();
        
        a2.on('remove', function(){
          
          _id2.should.not.equal( a1.getChild( 'data', 0 ) );
          done();
        })
        
        a1.getChild( 'data', 0 ).should.equal( _id2 );
        a2.remove();
        
        
      });
      
      it('#removeAt should remove __key__ and __pos__', function( done ){
        
        var _atomId1 = Atoms.insert( new LLMD.Atom('seq') );
        var a1 = new AtomModel( _atomId1 );
        var a2 = a1.addAfter('data', new LLMD.Atom('md'));
        
        a2.on('remove', function(){
          a1.get().data.should.have.length(0);
          done();
        });
        
        a1.removeAt('data',0);
        
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
  
  
  it('should insert an atom if no id is given', function(){
    
    var a = new AtomModel( new LLMD.Atom('md') );
    a.getId().should.be.a('string');
    
  });
  
  it('should export an ast', function(){
    var _atomId1 = Atoms.insert( new LLMD.Atom('seq') );
    var a1 = new AtomModel( _atomId1 );
    
    var ifAtom = a1.addAfter('data', new LLMD.Atom('if') );
    ifAtom.addAfter('t', new LLMD.Atom('md') );
    
    var ast = a1.export();
    
    ast.should.have.deep.property('data[0].t[0].name','md');
    
  });
  
  it('should import an ast if given', function(){
    
    var ast = {"data":[{"c":"true","f":[],"name":"if","t":[{"name":"md","data":""}]}],"name":"seq"};
    
    var a = new AtomModel( ast );
    var ast2 = a.export();
    
    JSON.stringify( ast2 ).should.equal( JSON.stringify(ast) );
    
  });
  
  describe('diff', function(){
    
    it('should cause a conflict', function(){
      
      var a = new AtomModel( new LLMD.Atom('md') );
      var _oldId = a.getId();
      a.lock();
      a.update({ data: '1' });
      
      a.diff( _oldId );
      a.get().meta.state.should.equal('conflict');
      
    }); 
    
    it('should hold a changed atom', function(){
      
      var a = new AtomModel( new LLMD.Atom('md') );
      var _oldId = a.getId();
      a.lock();
      a.update({ data: '1' });
      
      a.diff( _oldId );
      a.get().meta.diff.type.should.equal('change');
      a.get().meta.diff.atom.should.be.an('string');
      
    });
    
    it('should remove an atom', function(){
      
      var a = new AtomModel( new LLMD.Atom('seq') );
      var _oldId = a.getId();
      a.lock();
      var b = a.addAfter('data', new LLMD.Atom('md'));
      
      a.diff( _oldId );
      
      a.get().meta.state.should.equal('conflict');
      a.get().meta.diff.type.should.equal('change');
      
      var removedAtom = a.getChildModel( 'data', 0 );
      
      removedAtom.get().meta.state.should.equal('conflict');
      removedAtom.get().meta.diff.type.should.equal('remove');
      
    });
    
    
    it('should add an atom', function(){
      console.log('--');
      var a = new AtomModel( new LLMD.Atom('seq') );
      var _oldId = a.getId();
      a.lock();
      a.addAfter('data', new LLMD.Atom('md'));
      var _newId = a.getId();
      a = new AtomModel( _oldId );
      
      a.getId().should.not.equal( _newId );
      
      a.diff( _newId );
      
      a.get().meta.state.should.equal('conflict');
      a.get().meta.diff.type.should.equal('change');
      
      var addedAtom = a.getChildModel( 'data', 0 );
      
      addedAtom.get().meta.state.should.equal('conflict');
      addedAtom.get().meta.diff.type.should.equal('add');
      
    });
    
    	
  });
    
  
});


checkDefaultAtomValues = function( a, name ){
  a.should.have.property('_seedId').and.to.be.a('string');
  a.should.have.property('meta').and.to.be.a('object');
  a.should.have.property('name').and.to.equal( name );
}

