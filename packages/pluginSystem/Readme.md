# Usage

Extend your own plugin from the basic plugin:
```
MyPlugin = BasicPlugin.extend({
  build: function( ctx ){ return ast; },
  load: function( ctx, cb ) { cb(); },
  execute: function( cb ) { cb(); },
  render: function(){ return node; }
});
```

## Callbacks
### build
Binds the ast to the given context. 
Retuns eather `true`, if the ast was bound and cleaned up, `array` of asts if the ast resolve to nested asts or `null` if this ast should be ignorred.
### load
Async Loads the Plugin in the background. 
### execute
Run the Plugin.
### render
Render a node element
