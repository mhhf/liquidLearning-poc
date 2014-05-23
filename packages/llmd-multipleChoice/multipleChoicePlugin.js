MSPlugin = BasicPlugin.extend({
  build: function(ctx){
    
    // [TODO] - old style -> remove
    if( this.data && this.data[0] && this.data[0].name == 'expr' ) {
      this.data = ctx.context[this.data[0].key];
      return true;
    }
    
    if( this.questions && this.questions.name == 'expr' ) {
      this.data = ctx.context[this.questions.key];
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
  var q = this.data;
  for(var i in q) {
    q[i].id = 'ms_'+i;
  }
  return q;
}

Template.llmd_ast_multipleChoice.questions = function(){
  var q = this.data;
  return q;
}

Template.llmd_ast_multipleChoice.isCorrect = function(){
  return this.correct?'istrue':'isfalse';
}

var questions; 

Template.llmd_edit_multipleChoice.helpers({
  questions: function(){
    return questions.get();
  }
});

Template.llmd_edit_multipleChoice.created = function(){
  questions= {
    dep:	new Deps.Dependency,
    val: [],
    get: function(){
      this.dep.depend();
      return this.val;
    },
    set: function( val ){
      this.dep.changed();
      this.val = val;
    }
  };
};

Template.llmd_edit_multipleChoice.events = {
  "click #btn-add": function(e,t){
    e.preventDefault();
    
    var content = t.find('#content').value;
    var correct = t.find('#correct').checked;
    
    t.find('#content').value = "";
    t.find('#correct').checked = false;
    
    questions.val.push({ "content": content, "correct": correct });
    questions.dep.changed();
    
  }
}


Template.pkg_multipleChoice.events = {
  "change input": function(e,t){
    e.preventDefault();
    for(var i in t.data.data) {
      if( t.data.data[i].id == e.target.name ) {
        t.data.data[i].answer = e.target.checked;
        break;
      }
    }
  },
  "click button": function(e,t){
    e.preventDefault();
    
    var correct = true;
    var a;
    for( var i in t.data.data ) {
      a = t.data.data[i];
      correct = ( a.correct == !!a.answer ) && correct;
    }
    
    t.data.ctx.setContext(this.result.key, correct);
    
    this.unblock();
  }
};

