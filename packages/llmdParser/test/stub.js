fs = require('fs');
Parser = require('jison').Parser;
bnf = require('ebnf-parser');
Lexer = require('jison-lex');
chai = require('chai');

var should = require('chai').should()


describe('slide Parser', function(){

	// Load the grammer file and parse the parser
  before( function(done){
    var grammar = fs.readFileSync('src/llmdParser.y','utf8');
    parser = new Parser(grammar);
    done();
	});
  
  describe('??? blocks', function(){
    
    it('should find empty blocks', function() {
      parser.parse('{{#???}}\n{{/???}}\n').should.deep.equal([{exp:[]}]);
    });
    
    it('should ignore whitespace', function() {
      parser.parse('{{#???}}  \n{{/???}}\n').should.deep.equal([{exp:[]}]);
      parser.parse('{{#???}}\n{{/???}}  \n').should.deep.equal([{exp:[]}]);
      parser.parse('{{#???}}\t\n{{/???}}\n').should.deep.equal([{exp:[]}]);
      parser.parse('{{#???}}\n{{/???}}\t\n').should.deep.equal([{exp:[]}]);
    });
    
    it('should find full blocks', function() {
      parser.parse('{{#???}}\nasd\n{{/???}}\n').should.deep.equal([{exp:["asd"]}]);
    });
    
    it('should ignore empty lines', function() {
      parser.parse('{{#???}}\nasd\n\nasd\n{{/???}}\n').should.deep.equal([{exp:["asd","asd"]}]);
    });
    
  })
  
  describe('md blocks', function(){
    
    it('should find them', function(){
      parser.parse('asd\n').should.deep.equal([{md:"asd\n"}]);
    });
    
    it('should persist multiple lines', function(){
      parser.parse('line1\nline2\n').should.deep.equal([{md:"line1\nline2\n"}]);
    });
    
  });
  
  describe('package blocks', function(){
    
    it('should find them', function() {
      parser.parse('{{> packageName }}\n').should.deep.equal([{
        "package": "packageName",
        "data": ""
      }]);
    });
    
    it('should find package data', function() {
      parser.parse('{{> packageName {} }}\n').should.deep.equal([{
        "package": "packageName",
        "data": " {} "
      }]);
      
      parser.parse('{{> packageName {}}}\n').should.deep.equal([{
        "package": "packageName",
        "data": " {}"
      }]);
      
      parser.parse('{{> packageName \n{\n}\n}}\n').should.deep.equal([{
        "package": "packageName",
        "data": " \n{\n}\n"
      }]);
    });
    
    it('should find packageData nested json', function() {
      
      parser.parse('{{> packageName {a:{b:{c:"d"}}}}}\n').should.deep.equal([{
        "package": "packageName",
        "data": ' {a:{b:{c:"d"}}}'
      }]);
      
      
      // not supported yet
      // parser.parse('{{ packageName {a:"{b:c:d}}"}}}\n').should.deep.equal([{
      //   "package": "packageName",
      //   "data": ' {a:{b:{c:"d"}}}'
      // }]);
      // 
      // 
      // parser.parse('{{ packageName {a:"{b:{c:d}"}}}\n').should.deep.equal([{
      //   "package": "packageName",
      //   "data": ' {a:{b:{c:"d"}}}'
      // }]);
    });
    
  });
  
  describe('block interaction', function(){
    
    it('should find multiple blocks md,exp', function() {
      parser.parse('markdown1\n{{#???}}\nexp\n{{/???}}\n').should.deep.equal([{md:"markdown1\n"},{exp:["exp"]}]);
    });
    
    it('should find multiple blocks exp,md', function() {
      parser.parse('{{#???}}\nexp\n{{/???}}\nmarkdown1\n').should.deep.equal([{exp:["exp"]},{md:"markdown1\n"}]);
    });
    
    it('should find multiple blocks exp,md,exp,md', function() {
      parser.parse('{{#???}}\nexp\n{{/???}}\nmarkdown1\n{{#???}}\nexp2\n{{/???}}\nmarkdown2\n').should.deep.equal([{exp:["exp"]},{md:"markdown1\n"},{exp:["exp2"]},{md:"markdown2\n"}]);
    });
    
  });
  
});


var test = function( name ){
	var test   = fs.readFileSync('./test/tests/'+name+'.md','utf8');
	var result = fs.readFileSync('./test/tests/'+name+'.out','utf8');
	parser.parse(test).should.equal(result);
}
