MSPlugin = BasicPlugin.extend({
  build: function(ctx){
    
    if( this.data && this.data[0] && this.data[0].name == 'expr' ) {
      this.data = ctx.context[this.data[0].key];
      return true;
    } 
    
    return false;
  },
  blocking: true,
  template: 'pkg_multipleChoice',
  astTemplate: 'llmd_ast_multipleChoice',
  tmp: true
});

PluginHandler.registerPlugin( "multipleChoice", MSPlugin );

Template.pkg_multipleChoice.questions = function(){
  var q = this.data && this.data.questions;
  for(var i in q) {
    q[i].id = 'ms_'+i;
  }
  return q;
}

Template.llmd_ast_multipleChoice.questions = function(){
  var q = this.data && this.data.questions;
  return q;
}

Template.llmd_ast_multipleChoice.isCorrect = function(){
  return this.correct?'istrue':'isfalse';
}


Template.pkg_multipleChoice.events = {
  "change input": function(e,t){
    e.preventDefault();
    for(var i in t.data.data.questions) {
      if( t.data.data.questions[i].id == e.target.name ) {
        t.data.data.questions[i].answer = e.target.checked;
        break;
      }
    }
  },
  "click button": function(e,t){
    e.preventDefault();
    
    var correct = true;
    var a;
    for( var i in t.data.data.questions ) {
      a = t.data.data.questions[i];
      correct = ( a.correct == !!a.answer ) && correct;
    }
    
    t.data.ctx.setContext('paradox', correct);
    
    this.unblock();
  }
};

