Package.describe({
  summary: "LLMD Plugin - Markdown" 
});

Package.on_use(function (api) {
  api.use('llmdParser','server');
  api.use('pluginSystem','client');
  api.use('templating', 'client');
  api.use('minimongo', ['client','server']);
  api.use('less', 'client');
  
  
  api.use('marked','client');
  
  
  api.add_files("md.js", ["server"]);
  api.add_files("mdPlugin.js", ["client"]);
  
  // if(api)
  //   api.export('TTSPlugin');

});
