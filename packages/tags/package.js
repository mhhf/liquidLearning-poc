Package.describe({
  summary: "Tags for everything"
});

Package.on_use(function (api) {
  api.use('templating', 'client');
  api.use('less', 'client');
  
  api.use('minimongo', ['client', 'server']);
  api.use('collection2', ['client', 'server']);
  
  api.add_files("tags.js", ["client", "server"]);
  api.add_files("tagsView.html", "client");
  api.add_files("tagsView.js", "client");
  api.add_files("selectize.less", "client");
  
  if(api.export)
    api.export('Tags');
  
});
