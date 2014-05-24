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
  astTemplate: 'llmd_tts_ast',
  template: 'pkg_tts_view',
  tmp: true
});


PluginHandler.registerPlugin( "???", TTSPlugin );

Template.pkg_tts_view.getData = function(){
  return this.data;
}

Template.llmd_tts_ast.getData = function(){
  return this;
}
Template.llmd_tts_ast.getText = function(){
  if(typeof this.data == 'string' ) {
    return this.data;
  } else if(typeof this.text == 'string'){
    return this.text; 
  } else {
    return this;
  }
}
Template.pkg_tts_view.mute = function(){
  var ctx = this.ctx;
  return ctx && ctx.options && ctx.options.mute;
}
Template.llmd_tts_edit.rendered = function(){
  var data = this.data.atom.data.join('\n')
  var editor = CodeMirror(this.find('.editor'),{
    value: data || '',
    mode:  "markdown",
    lineNumbers: true,
    extraKeys: {"Ctrl-J": "autocomplete"},
    lines: 10
  });
  
  var self = this;
  this.data.ee.on('ready', function(){
    self.data.atom.name = 'tts';
    self.data.atom.data = editor.getValue().split('\n');
  });
  
}
