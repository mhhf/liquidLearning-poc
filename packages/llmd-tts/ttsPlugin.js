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


PluginHandler.registerPlugin( "tts", TTSPlugin );

Template.pkg_tts_view.getData = function(){
  console.log(this);
  return this.data;
}

Template.llmd_tts_ast.helpers({
  ready: function(){
    return !!this.link;
  }
});

Template.llmd_tts_ast.events = {
  "click .btn-play": function(e,t){
    var self = this;
    mediaHandler.loadSound( self, function(){
      mediaHandler.playSound( self.hash );
    });
  }
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

// [TODO] - rewrite data filter for the whole block, not just for lines
Template.llmd_tts_edit.rendered = function(){
  var data = _.pluck(this.data.atom.data,'text').join('\n')
    
  var editor = CodeMirror(this.find('.editor'),{
    value: data || '',
    mode:  "markdown",
    lineNumbers: true,
    extraKeys: {"Ctrl-J": "autocomplete"},
    lines: 10
  });
  
  var self = this;
  this.data.buildAtom = function(){
    
    var data = editor.getValue().split('\n');
    data = _.map( data, function( o ) { return { data: o }; });
    
    return {
      name: 'tts',
      data: LLMD.Package( 'tts' ).dataFilter( null, data )
    }
  }
}
