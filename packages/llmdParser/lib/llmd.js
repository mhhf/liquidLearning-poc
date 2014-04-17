LLMD = function() {
  this.currentNode = null;
}

LLMD.packageTypes = {};

 
// registers a new package
LLMD.registerPackage = function( name, o ){
  LLMD.packageTypes[name] = o;
}

LLMD.hasPreprocess = function( ast ){
  return (  ast.name && LLMD.packageTypes[ast.name] && LLMD.packageTypes[ast.name].preprocess );
}
LLMD.hasNested = function( ast ){
  return ( ast.name && LLMD.packageTypes[ast.name] && !!LLMD.packageTypes[ast.name].nested );
}

LLMD.applyNested = function( ast, f, cb ){
  var que = 0;
  var allDone = false;
  
  var nested = LLMD.packageTypes[ast.name].nested;
  
  for( var i in nested ) {
    que ++;
    f(ast[nested[i]], function(err, newAst){
      ast[nested[i]] = newAst;
      if( --que == 0 && allDone) 
        cb( null, ast );
    });
  }
  allDone = true;
  if( que == 0 ) 
    cb( null, ast );
  
}

// [TODO] - cleanup with subfunctions: eachNested
LLMD.preprocess = function( ast, cb ){
  var que = 0;
  var allDone = false;
  if( LLMD.hasPreprocess(ast) ) {
    if( LLMD.hasNested( ast ) ) {
      
      LLMD.applyNested( ast, LLMD.processNestedASTASYNC, function( err, ast ){
        LLMD.packageTypes[ast.name].preprocess(ast, cb);
      });
      
    } else {
      LLMD.packageTypes[ast.name].preprocess(ast, cb);
    }
  } else if( LLMD.hasNested( ast ) ) {
    LLMD.applyNested( ast, LLMD.processNestedASTASYNC, cb );
  } else {
    cb( null, ast );
  }
  
}

// [TODO] - cleanup: with promises?
LLMD.processNestedASTASYNC = function( ast, cb ){
  var retAST = [];
  var waitFor = 0;
  var allReady = false;
  
  // import files
  for (var i=0; i < ast.length; i++) {
    
    if( LLMD.hasPreprocess( ast[i] ) || LLMD.hasNested( ast[i] ) ) {
      
      waitFor ++;
      retAST.push(null);
      
      // Function Wrapper to perserve the right i value
      (function(i){
      
        LLMD.preprocess(ast[i], function(err,ret){
          // Insert at the right place
          retAST[i] = ret;
           
          // // Test if all preprocessor ready
          if( --waitFor == 0 && allReady ) {
            cb( null, _.flatten( retAST ) );
          }
        });
        
      })(i)
      
    } else {
      retAST.push(ast[i]);
    }
  }
  
  allReady = true;
  if( waitFor == 0 ) cb( null, _.flatten( retAST ) );
  
}
LLMD.processNestedAST = Meteor._wrapAsync( LLMD.processNestedASTASYNC );


LLMD.prototype.filterRoot = function( rawData ) {
  return cleanBlocks( rawData );
}

LLMD.prototype.newBlock = function( name, params, data ) {
  var type;
  
  if( LLMD.packageTypes[name] ) {
    type = LLMD.packageTypes[name];
  }
  
  var node = new LLMD.Block( type, name, params, data );
  
  this.currentNode = node;
  return node;
}

LLMD.prototype.newPackage = function( name, params ){
  var type;
  
  if( LLMD.packageTypes[name] ) {
    type = LLMD.packageTypes[name];
  }
  
  return new LLMD.Package( type, name, params );
}

LLMD.prototype.newExpr = function( key ){
  return new LLMD.Expr( key );
}

LLMD.Block = function( type, name, params, data ){
  this.name = name;
  // if the Blocktype has a Data Filter, do the filter, otherwise return the piain data
  var filteredData;
  
  if(type && type.dataFilter && (filteredData = type.dataFilter.apply( this, [params, data] ))) this.data = filteredData;
  else if(!type || !type.dataFilter) this.data=data;
  
  return this;
}

// example data filter for if
LLMD.Package = function( type, name, data ) {
  this.name = name;
  
  if(type && type.dataFilter && (filteredData = type.dataFilter.apply( this, [data] ))) this.data = filteredData;
  else if(!type || !type.dataFilter) this.data=data;
  
}

LLMD.Expr = function( key ){
  this.name = 'expr';
  this.key = key;
}

// [TODO] - only push l if !!l.data.match(/^\s*$/) 
var cleanBlocks = function( bs ){
  
  var blocks = [];
  var l;
  if( 0 in bs )
    l = bs[0];

  for(var i = 1; i<bs.length; i++) {
    if( ( !bs[i]['name'] || bs[i]['name'] == "md" ) &&
         ( !l['name'] || l['name'] == "md" ) && (l.name = "md")) {
        l['data'] += bs[i]['data'];
    } else if( l && l.name && l.name != 'md' || l.name == 'md' && !l.data.match(/^\s*$/) ) {
      blocks.push(l)
      l = bs[i];
    } else {
      l = bs[i];
    }
  }
  
  if( l && l.name && l.name != 'md' || l.name == 'md' && !l.data.match(/^\s*$/) ) {
    blocks.push(l);
  }
  return blocks;
}
