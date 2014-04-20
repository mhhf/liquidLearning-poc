Package.describe({
  summary: "LLMD Plugin - wait blocker" 
});

Package.on_use(function (api) {
  api.use('pluginSystem','client');
  api.use('templating','client');
  
  api.add_files("waitPlugin.js", ["client"]);
  api.add_files("waitPlugin.html", ["client"]);
  
  // if(api)
  //   api.export('TTSPlugin');

});
