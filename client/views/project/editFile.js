Template.editFile.rendered = function(){
  editor = CodeMirror(this.find('#editor'),{
    value: this.data.file.data,
    mode:  "markdown",
    lineNumbers: true,
    extraKeys: {"Ctrl-J": "autocomplete"}
  });
}
