TTSPlugin = BasicPlugin.extend({
  load: function( ctx, cb ){
    // ctx.soundBuffer.preload( ctx, cb );
    
    setTimeout(function(){

      cb();

    },2000);
  },
  execute: function( cb ){
    
    setTimeout( function(){
      
      cb();
      
    },1000);
    
  }
});


PluginHandler.registerPlugin( "???", TTSPlugin );
