Package.describe({
  summary: "LLMD Plugin - tts block" 
});

Package.on_use(function (api) {
  api.use(['llmdParser','tts','belt-md5'],'server');
  api.use('pluginSystem','client');
  api.use('templating', 'client');
  api.use('minimongo', ['client','server']);
  api.use('less', 'client');
  
  api.add_files("tts.js", ["server"]);
  api.add_files("ttsPlugin.js", ["client"]);
  api.add_files("ttsView.html", ["client"]);
  api.add_files("ttsView.less", ["client"]);
  
  // if(api)
  //   api.export('TTSPlugin');

});
