Package.describe({
  summary: "LLMD Plugin - include block" 
});

Package.on_use(function (api) {
  api.use('llmdParser','server');
  
  api.add_files("include.js", ["server"]);

});
