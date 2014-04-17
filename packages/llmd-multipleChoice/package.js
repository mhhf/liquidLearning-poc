Package.describe({
  summary: "LLMD Plugin - multipleChoice block" 
});

Package.on_use(function (api) {
  api.use(['llmdParser'],'server');
  api.use('pluginSystem','client');
  api.use('templating', 'client');
  api.use('minimongo', ['client','server']);
  api.use('less', 'client');
  
  api.add_files("multipleChoicePlugin.js", ["client"]);
  
  // if(api)
  //   api.export('TTSPlugin');

});
