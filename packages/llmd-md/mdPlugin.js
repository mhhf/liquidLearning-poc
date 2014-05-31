// newAtom(type)



MDPlugin = BasicPlugin.extend({
  render: function(){
    var divWrapper = document.createElement('div');
    divWrapper.innerHTML = marked( this.data );
    return divWrapper;
  }
});

PluginHandler.registerPlugin( "md", MDPlugin );




Template.llmd_md_edit.rendered = function(){
  var data = this.data.atom.data;
  var editor = CodeMirror(this.find('.editor'),{
    value: data || '',
    mode:  "markdown",
    lineNumbers: true,
    extraKeys: {"Ctrl-J": "autocomplete"},
    lines: 10
  });
  
  var self = this;
  this.data.updateChange = function(){
    self.data.atom.name = 'md';
    self.data.atom.data = editor.getValue();
    self.data.change();
  }
  
  // this.data.ee.on('ready', function(){
  //   self.data.atom.name = 'md';
  //   self.data.atom.data = editor.getValue();
  // });
}
