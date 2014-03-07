//tests/posts.js
var assert = require('assert');

suite('Posts', function() {
  
  test('in the server', function(done, s, c) {
    
    s.eval(function() {
      Git.buildTree('/Users/mhhf/llWd/',{hash:'ee98eecaaa90d7e6560e1d2592927a0e'})
    });
    
  });
  
});
