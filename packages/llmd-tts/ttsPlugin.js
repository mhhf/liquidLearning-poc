TTSPlugin = BasicPlugin.extend({
  load: function( ctx, cb ){
    
    ctx.mediaHandler.initSounds( this.data, cb );
      
    
  },
  execute: function( ctx, cb ){
    
    ctx.mediaHandler.playSounds( this.data, cb );
    
  },
  previewTemplate: 'llmd_preview_tts'
});


PluginHandler.registerPlugin( "???", TTSPlugin );
