Package.describe({
  summary: "LLMD Plugin - tts block" 
});

Package.on_use(function (api) {
  api.use(['llmdParser','tts','belt-md5'],'server');
  
  api.add_files("tts.js", ["server"]);

});
