describe('TagModel', function(){
  
  describe('#constructor', function(){
    
    it('should be created', function(){
      var t = new TagModel({
        type: 'branch'
      });
      
      t.getId().should.be.a('string');
    }); 
    
    it('should be created with an _id', function(){
      
      var t = new TagModel({
        type: 'branch'
      });
      
      var t_ = new TagModel( t.getId() );
      
      t_.getId().should.equal( t.getId() );
      
    });
    	
  });
  
  describe('#getCommit()', function(){
    
    it('should return the commit', function(){
      
      var t = new TagModel({
        type: 'branch'
      });
      
      var c = t.getCommit();
      
      c.getId().should.be.a('string');
      
    });
    	
  });
  
  describe('branch', function(){
    
    it('should update on commit update', function(){
      
      var t = new TagModel({
        type: 'branch'
      });
      
      var c = t.getCommit();
      
      var a = c.getRoot();
      a.addAfter('data', new LLMD.Atom('md'));
      
      c.commit({ msg: 'bla' });
      
      t.getCommit().should.not.equal( c );
      
    });
    	
  });
  
});
