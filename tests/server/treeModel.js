describe("Tree", function() {
  
  
  it("should be created without an atom", function() {
    
    var tree = new TreeModel();
    
    tree.should.be.a('object');
    
  });
  
  it('should export ast tree', function(){
    
    var _atomId1 = Atoms.insert( new LLMD.Atom('seq') );
    var a1 = new AtomModel( _atomId1 );
    
    var ifAtom = a1.addAfter('data', new LLMD.Atom('if') );
    ifAtom.addAfter('t', new LLMD.Atom('md') );
    
    var tree = new TreeModel( _atomId1 );
    
    var ast = tree.export();
    
    ast.should.have.deep.property('data[0].t[0].name','md');
    
  });
  
  
  it('should import ast tree', function(){
    
    var tree = new TreeModel();
    var json = {"data":[{"c":"true","f":[],"name":"if","t":[{"name":"md","data":""}]}],"name":"seq"};
    
    tree.import( json );
    
    tree.exportJSON().toString().should.deep.equal( json.toString() );
    
    
  });
  
  
  // should trigger __change.root__ if ___rootId__ has changed
  
  
  
});
