var editor;

Template.editFile.rendered = function(){
  console.log(this.data);
  
  editor = CodeMirror(this.find('#editor'),{
    value: this.data.file.data || '',
    mode:  "markdown",
    lineNumbers: true,
    extraKeys: {"Ctrl-J": "autocomplete"}
  });
}

Template.editFile.events = {
  "click a.save": function(e,t) {
    e.preventDefault();
    
    var _id = this.project._id;
    var filepath = this.file.path;
    
    // [TODO] - validate md: parse and check errors
    bootbox.prompt("What did you changed?", function(result) {                
      if (result === null) {                                             
        
      } else {
        var md = editor.getValue();
        
        // [todo] - feedback
        Meteor.call('saveFile', _id, { 
          md: md,
          commitMsg: result,
          filepath: filepath 
        });
      }
    }); 
    
  }
}

