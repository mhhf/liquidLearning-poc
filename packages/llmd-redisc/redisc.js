LLMD.registerPackage("redisc", {
  init: function(){
    this.data = '';
    this.title = '';
    this.code = '';
    
    this.upvotes = [];
    this.downvotes = [];
    this.score = 0;
    
    
    this.nested = '';
    this.comments = 0;
    
    this.tags = [];
    this.root = '';
    
    this.createdOn = new Date();
    this.updatedOn = new Date();
    
  },
  // [TODO] - is it really nessesery?
  // dataFilter: function( params, rawData ){
  //   var data = "";
  //     
  //   if( rawData.length && rawData.length>0 ) {
  //     for( var i in rawData ) {
  //       data+= rawData[i].data;
  //     }
  //   }
  //   
  //   return data;
  // },
  // [TODO] - is it really nessesery?
  preprocess: function( ast, cb ){
    
      cb( null, ast );
    
  }
});
