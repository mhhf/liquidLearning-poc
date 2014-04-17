IFPlugin = BasicPlugin.extend({
  // export to server? async?
  build: function( ctx, last ){
    
    var val = this.c && this.c.key && ctx.context[this.c.key];
    
    // check if value is there
    if( val == null && !last ) return false;
    
    if( val ) {
      return this.t;
    } else {
      return this.f;
    }
    
  }
});


PluginHandler.registerPlugin( 'if', IFPlugin );
