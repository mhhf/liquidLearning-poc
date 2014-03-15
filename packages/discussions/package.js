Package.describe({
  summary: "Posts - Discussion plugin"
});

Package.on_use(function (api) {
  api.use('templating', 'client');
  api.use('minimongo', ['client','server']);
  api.use('less', 'client');
  
  
  api.add_files("posts.html" , ["client"]);
  api.add_files("post.html"  , ["client"]);
  api.add_files("new.html"   , ["client"]);
  api.add_files("posts.js"   , ["client"]);
  api.add_files("post.js"    , ["client"]);
  api.add_files("new.js"     , ["client"]);
  
  
  api.add_files("discussions.js"     , ["client", "server"]);
  
  api.add_files("discussions.less"    , ["client"]);
  
  if(api.export)
    api.export('DPosts');
  
});
