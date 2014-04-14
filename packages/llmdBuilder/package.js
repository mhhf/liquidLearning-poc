Package.describe({
  summary: "LiquidLearning Markdown AST Builder"
});

Package.on_use(function (api) {
  
  api.use('llmdParser','server');
  api.use('llmd-include','server');
  api.use('llmd-common','server');
  api.use('llmd-tts','server');
  
  api.add_files("LLMDOptimizer.js", ["server"]);
  api.add_files("LLMDBuilder.js", ["server"]);

  if (api.export) {
    api.export('LLMDBuilder');
  }
  
});

Package.on_test( function(api){
  api.use(['llmdParser','llmdBuilder', 'tinytest', 'test-helpers'], ['server']); 
  
  api.use('llmd-include','server');
  api.use('llmd-common','server');
  api.use('llmd-tts','server');
  
  api.add_files("LLMDOptimizer.js", ["server"]);
  api.add_files("LLMDBuilder.js", ["server"]);
  
  api.add_files("test/mock.js", ["server"]);
  api.add_files("test/buildProject.js", ["server"]);
  
});
