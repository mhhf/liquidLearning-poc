// newAtom(type)



RediscPlugin = BasicPlugin.extend({
  render: function(){
    var divWrapper = document.createElement('div');
    divWrapper.innerHTML = marked( this.data );
    return divWrapper;
  }
});

PluginHandler.registerPlugin( "md", RediscPlugin );



var tags;
Template.llmd_redisc_edit.rendered = function(){
  
  var self = this;
  
  var data = ( this.data.atom && this.data.atom.data ) || ''; 
  
  var dataEditor = CodeMirror(this.find('.dataEditor'),{
    value: data,
    mode:  "markdown",
    lineNumbers: true,
    lines: 10
  });
  
  var codeEditor = CodeMirror(this.find('.codeEditor'),{
    value: data,
    mode:  "javascript",
    theme: "monokai",
    lineNumbers: true,
    lines: 10
  });
  
  $('select').selectize({
    create: true, 
    onChange: function(t){
      tags = t;
    }
  });
  
  this.data.buildAtom = function(){
    return {
      data: dataEditor.getValue(),
      code: codeEditor.getValue(),
      tags: tags,
      title: self.find('input[name=title]').value
    }
  }
  
}

Template.llmd_redisc_ast.rendered = function(){
}

Template.llmd_redisc_ast.helpers({
});
