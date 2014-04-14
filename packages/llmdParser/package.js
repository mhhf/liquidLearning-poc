Package.describe({
  summary: "LiquidLearning Markdown AST Parser"
});

Package.on_use(function (api) {
  api.add_files("lib/llmd.js", ["client","server"]);
  api.add_files("llmdParser.js", ["client","server"]);

  if (api.export) {
    api.export('LlmdParser');
    api.export('LLMD');
  }
  
});
