Package.describe({
  summary: "LLMD Common Plugins" 
});

Package.on_use(function (api) {
  api.use('llmdParser','server');
  api.use('pluginSystem','client');
  
  api.add_files("common.js", ["server"]);
  api.add_files("commonPlugins.js", ["client"]);

});
