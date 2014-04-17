Package.describe({
  summary: "LLMD AST Interpreter"
});

Package.on_use(function (api) {
  
  
  api.add_files("llmdInterpreter.js", ["client"]);

  if (api.export) {
    api.export('LLMDInterpreter');
  }
  
});

Package.on_test( function(api){
});
