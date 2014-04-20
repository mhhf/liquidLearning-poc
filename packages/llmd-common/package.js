Package.describe({
  summary: "LLMD Common Plugins" 
});

Package.on_use(function (api) {
  api.use('llmdParser','server');
  api.use('pluginSystem','client');
  api.use('templating','client');
  api.use('less','client');
  
  api.add_files("common.js", ["server"]);
  api.add_files("commonPlugins.html", ["client"]);
  api.add_files("commonPlugins.less", ["client"]);
  api.add_files("commonPlugins.js", ["client"]);

});
