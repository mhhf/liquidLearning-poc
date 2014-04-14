Package.describe({
  summary: "LLMD Common Plugins" 
});

Package.on_use(function (api) {
  api.use('llmdParser','server');
  
  api.add_files("common.js", ["server"]);

});
