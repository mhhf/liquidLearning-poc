describe('CommitModel', function(){
  
  it('should be createded without an id', function(){
    
    var c = new CommitModel();
    c.getRoot().should.be.an('object');
    c.getCommit().should.have.a.property('_seedId')
    .and.be.a('string');
    	
  });
  
  it('should be created with an id', function(){
    
    var _cId = Commits.insert({});
    
    var c = new CommitModel( _cId );
    
    c.getCommit()._id.should.equal( _cId );
    
  });
  
  describe('#commit', function(){
    
    it('should lock atoms', function(){
      
      var c = new CommitModel(); 
      
      var a = c.getRoot();
      
      c.commit({ msg: 'init' });
      
      a.isLocked().should.be.true;
      
    });
    
    it('should lock nested atoms on commit', function(){
      
      var c = new CommitModel(); 
      
      var a = c.getRoot();
      
      c.commit({ msg: 'init' });
      
      var b = a.addAfter('data', new LLMD.Atom('md') );
      
      c.commit({ msg: 'md added' });
      
      a.isLocked().should.be.true;
      b.isLocked().should.be.true;
      
    });
    
    
    it('should commit properly', function(){
      var c = new CommitModel(); 
      
      var a = c.getRoot();
      
      var _cId = c.getCommit()._id;
      
      c.commit({ msg: 'init' });
      
      var b = a.addAfter('data', new LLMD.Atom('md') );
      
      c.getCommit()._id.should.not.equal( _cId );
      
      c.commit({ msg: 'md added' });
      
      b.update({ data: '1' });
      a.isLocked().should.be.false;
      b.isLocked().should.be.false;
      
      c.commit({ msg: 'md updated' });
      
    });
    	
  });
  
  	
});
