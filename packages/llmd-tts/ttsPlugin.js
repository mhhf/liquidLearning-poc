TTSPlugin = BasicPlugin.extend({
  build: function(ctx){
    this.mute = ctx.options && ctx.options.mute;
    
    return true;
  },
  load: function( ctx, cb ){
    
    if( !ctx.options.mute )
      ctx.mediaHandler.initSounds( this.data, cb );
    else cb();
      
    
  },
  execute: function( ctx, cb ){
    
    if( !ctx.options.mute )
      ctx.mediaHandler.playSounds( this.data, cb );
    
  },
  astTemplate: 'llmd_ast_tts',
  template: 'pkg_tts_view',
  tmp: true
});


PluginHandler.registerPlugin( "???", TTSPlugin );

Template.pkg_tts_view.getData = function(){
  return this.data;
}

Template.llmd_ast_tts.getData = function(){
  console.log(this);
  return this.data;
}
Template.llmd_ast_tts.getText = function(){
  if(typeof this.data == 'string' ) {
    return this.data;
  } else {
    return this.text; 
  }
}
Template.pkg_tts_view.mute = function(){
  var ctx = this.ctx;
  return ctx && ctx.options && ctx.options.mute;
}
