LLMD.registerPackage("???", {
  dataFilter: function( params, rawData ){
    var data = [];
    
    if(params && params.length == 1) this.lang = params[0];
    
    for( var block in rawData ) {
      // interpret als sentance
      if( !block.name ) data.push( rawData[block].data );
    }
    
    return data;
  }
});
