Package.describe({
  summary: "LLMD Plugin - multipleChoice block" 
});

Package.on_use(function (api) {
  api.use(['llmd-core'],['client','server']);
  
  api.use('templating', 'client');
  api.use('minimongo', ['client','server']);
  api.use('less', 'client');
  api.use('deps', 'client');
  
  api.add_files("multipleChoice.html", ["client"]);
  api.add_files("multipleChoice.less", ["client"]);
  api.add_files("multipleChoicePlugin.js", ["client"]);
  
  // if(api)
  //   api.export('TTSPlugin');

});
