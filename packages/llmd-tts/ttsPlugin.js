TTSPlugin = BasicPlugin.extend({
  init: function(){
    this.mute = true;
  },
  load: function( ctx, cb ){
    
    if( !this.mute )
      ctx.mediaHandler.initSounds( this.data, cb );
    else cb();
      
    
  },
  execute: function( ctx, cb ){
    
    if( !this.mute )
      ctx.mediaHandler.playSounds( this.data, cb );
    
  },
  previewTemplate: 'llmd_preview_tts',
  template: 'pkg_tts_view'
});


PluginHandler.registerPlugin( "???", TTSPlugin );

Template.pkg_tts_view.getData = function(){
  return this.data;
}
