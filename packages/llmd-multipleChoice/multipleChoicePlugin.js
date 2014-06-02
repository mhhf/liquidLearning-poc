LLMD.registerPackage("multipleChoice", {
  skeleton: {name: 'multipleChoice', questions: []}
});


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

Template.llmd_multipleChoice_ast.questions = function(){
  var q = this.data;
  return q;
}

Template.llmd_multipleChoice_ast.isCorrect = function(){
  return this.correct?'istrue':'isfalse';
}

Template.llmd_multipleChoice_edit.helpers({
  questions: function(){
    return this.questions.get();
  },
  getCheckedClass: function(){
    return this.correct?'fa-check-square-o':'fa-square-o';
  }
});

Template.llmd_multipleChoice_edit.created = function(){
  this.data.questions = new function(){
    this.dep =	new Deps.Dependency,
    this.val= [],
    this.get= function(){
      this.dep.depend();
      return this.val;
    },
    this.set= function( val ){
      this.dep.changed();
      this.val = val;
    }
  };
  
  var self = this;
  this.data.buildAtom = function(){
    return { questions: self.data.questions };
  }
};

Template.llmd_multipleChoice_edit.events = {
  "submit": function(e,t){
    e.preventDefault();
    
    var content = t.find('[name=content]').value;
    var correct = t.find('[name=correct]').checked;
    
    t.find('[name=content]').value = "";
    t.find('[name=correct]').checked = false;
    
    this.questions.val.push({ "content": content, "correct": correct });
    this.questions.dep.changed();
    
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

