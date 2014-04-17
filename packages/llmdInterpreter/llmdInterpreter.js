LLMDInterpreter = function( ast ){
  this.pointer = 0;
  this.ast = ast;
  this.ast.reverse();
  // Plugin Objects ready to execute
  this.history = [];
  
  this.ts = new TS();
  
  this.buildQue = new ReactiveQue({
    ctx: this,
    isReadyFunction: 'isBuild',
    preApply: this.build,
    postApply: this.onBuild
  });
  this.bufferQue = new ReactiveQue({ 
    ctx: this,
    postApply: this.onLoaded,
    isReadyFunction: 'isLoaded' 
  });
  this.playerQue = new ReactiveQue({ 
    ctx: this, 
    preApply: this.run,
    isReadyFunction: 'isUnblocked',
    isPendingFunction: 'isRun',
  });
  
  // CTX
  this.ctx = new CTX();
  var self = this;
  
  Meteor.autorun( function(){
    var ctx = self.ctx.get();
    self.buildQue.test();
  });
  
}

LLMDInterpreter.prototype.buffer = function( num ){
  for(var i=0; i<num; i++ ) {
    this.next();
  }
}

// 2. binds the current Context to the ast
// 
// [TODO] - Iterator and play controll
// [TODO] - context binder

LLMDInterpreter.prototype.next = function(){
  
  var item = this.ast.pop();
  if(!item) return null;
  
  // check if block has a Plugin associated
  if( !PluginHandler.plugin[item.name] ) throw new Error('no Plugin "'+item.name+'" defined');

  // create the Plugin
  var atom = new PluginHandler.plugin[item.name]( item );
  var self = this;
  
  this.buildQue.enqueue( atom );
  // this.build( atom );
}

LLMDInterpreter.prototype.load = function( atom ){
  
  var self = this;
  atom
  .loadingWrapper()
  .then( function(suc){
    self.bufferQue.test();
  });
  
  this.bufferQue.enqueue( atom );
  
}

LLMDInterpreter.prototype.build = function( atom ){
  // console.log('building Atom');
  
  var build = atom.buildWrapper( this.ctx.get() );
    
  if( build && build.length ) {
    console.log('new ast chain concat');
    
    this.buildQue.queue = this.buildQue.queue.slice(1);
    
    var tmpQue = [];
    for(var i=0; i<build.length; i++) {
      tmpQue.push( new PluginHandler.plugin[build[i].name]( build[i] ) );
    }
    
    this.buildQue.queue = tmpQue.concat( this.buildQue.queue );
    
    this.buildQue.test();
    
  } else if( build ){
    this.buildQue.test();
  } else {
    console.log('WARN: Build: some context error');
  }
  
}


LLMDInterpreter.prototype.onLoaded = function( atom ){
  
  console.log(this.ts.get(),' loaded ',atom.name);
  
  this.playerQue.enqueue( atom );
  
}

LLMDInterpreter.prototype.onBuild = function( atom ){
  
  console.log(this.ts.get(),' build ',atom.name);
  
  if( !atom._container )
    this.load( atom ); 
}

LLMDInterpreter.prototype.run = function( instance ){
  
  console.log(this.ts.get(),' run ',instance.name);
  this.next();
  
  var self = this;
  instance
    .executeWrapper(function(){
      if(instance.domNode)
        $('#slideWrapper')[0].appendChild( instance.domNode );
    })
    .then(function(){
      self.playerQue.test();
    });
    
    
  
}

// [TODO] - Options - pre ready execution (md)/ post ready execution()
ReactiveQue = function( o ){
  
  this.queue = [];
  this.queueDep = new Deps.Dependency;
  
  this.dequeue = function(){
    this.queueDep.depend();
    
    // (0 in this.queue) && console.log('ready Test: ',this.queue[0][o.isReadyFunction]());
    this.top() && this.preHook(this.top());
    if(this.top() && this.queue[0][o.isReadyFunction]() ) {
      var atom = this.top();
      this.queue = this.queue.slice(1);
      return atom;
    } else {
      return null;
    }
  }
  
  this.enqueue = function( val ){
    this.queue.push( val );
    this.queueDep.changed();
  }
  
  this.test = function(){
    this.queueDep.changed();
  }
  
  this.top = function(){
    if( 0 in this.queue )
      return this.queue[0];
    else
      return null;
  }
  
  this.preHook = function(atom){
    if (!o.isPendingFunction || !atom[o.isPendingFunction]())
    {
      o.preApply && o.preApply.apply( o.ctx, [atom] );
    }
  }
  
  
  var self = this;
  Meteor.autorun( function(){
    var atom; 
    
    for(var atom = self.dequeue(); atom != null; atom = self.dequeue() ){
      o.postApply && o.postApply.apply( o.ctx, [atom] );
    }
      
  });
}

TS = function(){
  this.t = +(new Date());
  
  this.get = function(){
    var tn = +(new Date());
    var dt = tn - this.t;
    this.t = tn;
    return dt;
  }
}

CTX = function(){
  this.ctx = {};
  this.ctxDep = new Deps.Dependency;
  this.get = function(){
    this.ctxDep.depend();
    return this.ctx;
    
  }
  this.change = function(){
    this.ctxDep.changed();
  }
}
