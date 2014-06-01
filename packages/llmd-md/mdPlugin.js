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
  
  this.data.buildAtom = function(){
    return {
      name: 'md',
      data: editor.getValue()
    }
  }
  
}
