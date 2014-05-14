Package.describe({
  summary: "Tags for everything"
});

Package.on_use(function (api) {
  api.use('minimongo', ['client', 'server']);
  api.use('collection2', ['client', 'server']);
  
  api.add_files("tags.js", ["client", "server"]);
  
  if(api.export)
    api.export('Tags');
  
});
