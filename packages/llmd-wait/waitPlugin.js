WaitPlugin = BasicPlugin.extend({
  execute: function( ctx, cb ){
    // block 
  },
  astTemplate: 'llmd_ast_wait'
});

PluginHandler.registerPlugin( "wait", WaitPlugin);
