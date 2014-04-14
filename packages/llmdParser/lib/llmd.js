// [TODO] - merge block and package types to plugin types
LLMD = function() {
  this.currentNode = null;
}

LLMD.packageTypes = {};

 
// registers a new package
LLMD.registerPackage = function( name, o ){
  console.log('Package '+name+" added");
  LLMD.packageTypes[name] = o;
}

LLMD.hasPreprocess = function( ast ){
  return (  ast.name && LLMD.packageTypes[ast.name] && LLMD.packageTypes[ast.name].preprocess );
}
LLMD.preprocess = function( ast, cb ){
  
  if( LLMD.hasPreprocess(ast) ) LLMD.packageTypes[ast.name].preprocess(ast, cb);
  else cb( null, ast );
  
}

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

var cleanBlocks = function( bs ){
  
  var blocks = [];
  var l;
  if( 0 in bs )
    l = bs[0];

  for(var i = 1; i<bs.length; i++) {
    if( ( !bs[i]['name'] || bs[i]['name'] == "md" ) &&
         ( !l['name'] || l['name'] == "md" ) && (l.name = "md")) {
        l['data'] += bs[i]['data'];
    } else {
      blocks.push(l)
      l = bs[i];
    }
  }
  
  if( l )
    blocks.push(l);
  return blocks;
}
