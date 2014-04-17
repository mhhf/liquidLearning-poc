Package.describe({
  summary: "Plugin System for LLMD"
});

Package.on_use(function (api) {
  
  
  api.add_files("plugin.js", ["client"]);
  api.add_files("handler.js", ["client"]);

  if (api.export) {
    api.export('BasicPlugin');
    api.export('PluginHandler');
  }
  
});

Package.on_test( function(api){
  
});
