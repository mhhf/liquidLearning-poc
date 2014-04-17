IFPlugin = BasicPlugin.extend({
  build: function( ctx ){
    if( this.c && ctx[this.c] ) {
      return this.t;
    } else {
      return this.f;
    }
  }
});


PluginHandler.registerPlugin( 'if', IFPlugin );
