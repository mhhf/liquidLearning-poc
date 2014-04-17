Package.describe({
  summary: "SyncQue - linear blocking event handler"
});

Package.on_use(function (api) {
  
  
  api.add_files("syncque.js", ["client"]);

  if (api.export) {
    api.export('SyncQue');
  }
  
});

Package.on_test( function(api){
  
});
