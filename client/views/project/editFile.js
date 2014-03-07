Template.editFile.rendered = function(){
  editor = CodeMirror(this.find('#editor'),{
    value: this.data.fileData,
    mode:  "markdown",
    lineNumbers: true,
    extraKeys: {"Ctrl-J": "autocomplete"}
  });
}
