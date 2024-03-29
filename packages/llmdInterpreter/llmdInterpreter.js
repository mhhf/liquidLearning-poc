LLMDInterpreter = function( ast, ctx ){
  this.renderCounter = 0;
  this.pointer = 0;
  this.ast = ast;
  this.ast.reverse();
  // Plugin Objects ready to execute
  this.history = [];
  
  this.ts = new TS();
  
  // this.pause = true;
  
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
    postApply: this.onCleanup,
    isReadyFunction: 'isUnblocked',
    isPendingFunction: 'isRun',
  });
  
  // CTX
  this.ctx = new CTX(ctx);
  var self = this;
  
  Meteor.autorun( function(){
    var ctx = self.ctx.get();
    self.buildQue.test();
  });
  
  this.isLoading = function(){
    var pq = self.playerQue.empty();
    var bq = self.bufferQue.empty();
    return (pq && !bq);
  }
  
  this.isPlaying = function(){
    return self.playerQue.top();
  }
  
  this._pause = true;
  var pauseDep = new Deps.Dependency;
  
  this.isReady = function(){
    var pq = self.playerQue.empty();
    var bq = self.bufferQue.empty();
    return pq && bq && ( this.ast.length == 0 );
  }
  this.isPause = function(){
    pauseDep.depend();
    return self._pause;
    
  }
  this.togglePause = function( val ){
    if( self.pause === val ) return false;
    self._pause = val;
    pauseDep.changed();
    this.playerQue.test();
  }
  
}

LLMDInterpreter.prototype.buffer = function( num ){
  for(var i=0; i<num; i++ ) {
    this.next();
  }
}

LLMDInterpreter.prototype.valid = function( atom ){
  return !!atom;
}

LLMDInterpreter.prototype.next = function(){
  var item;
  // while( !this.valid( item = this.ast.pop()) ) { }
  item = this.ast.pop();
  if(!item) return null;
  
  // check if block has a Plugin associated
  if( !PluginHandler.plugin[item.name] ) throw new Error('no Plugin "'+item.name+'" defined');

  // create the Plugin
  var atom = new PluginHandler.plugin[item.name]( item, this.ctx );
  var self = this;
  
  this.buildQue.enqueue( atom );
  // this.build( atom );
}

LLMDInterpreter.prototype.getOption = function(k){
  return this.ctx.get().options[k];
}

LLMDInterpreter.prototype.load = function( atom ){
  
  var self = this;
  atom
  .loadingWrapper(this.ctx.ctx)
  .then( function(suc){
    self.bufferQue.test();
  });
  
  this.bufferQue.enqueue( atom );
  
}

LLMDInterpreter.prototype.build = function( atom ){
  // console.log('building Atom');
  
  var build = atom.buildWrapper( this.ctx.get(), this.isLastBuildBlocking( atom ) );
    
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
  }  
}

// needed to hold the build que: if context is provided in the last block and used right after that, the build proccess of the atom has to wait for it
LLMDInterpreter.prototype.isLastBuildBlocking = function(atom){
  var atomIsLastToBuild = this.buildQue.top() === atom;
  var loadingQueIsEmpty = this.bufferQue.empty();
  var playerQueIsEmpty = this.playerQue.empty();
    
  return atomIsLastToBuild && loadingQueIsEmpty && playerQueIsEmpty;
}


LLMDInterpreter.prototype.onLoaded = function( atom ){
  
  console.log( atom.name+" loaded "+this.ts.get() );
  
  this.playerQue.enqueue( atom );
  
}

LLMDInterpreter.prototype.onBuild = function( atom ){
  
  console.log( atom.name+" build "+this.ts.get() );
  
  if( !atom._container )
    this.load( atom ); 
}

// [TODO] - replace with post renderer
LLMDInterpreter.prototype.onCleanup = function( atom ){
  console.log( atom.name+ " cleanup "+this.ts.get() );
  
  if( atom.tmp ) $( '#atom_'+atom.id ).remove();
  if( atom.displaytime ) setTimeout( function(){
    $( '#atom_'+atom.id ).remove();
  },parseInt(atom.displaytime.key));
}

LLMDInterpreter.prototype.render = function( atom ){
  
  atom.id = this.renderCounter++;
  
  var rendered = false;
  var fragment = document.createElement('div');
  fragment.className = "atomWrapper";
  fragment.id = "atom_" + ( atom.id );

  if(atom.domNode) {
    rendered = true;
    fragment.appendChild( atom.domNode );
  }
  if( atom.ui ) {
    rendered = true;
    UI.insert( atom.ui, fragment ); 
  }
  
  $('#slideWrapper #scrollWrapper')[0].appendChild(fragment);

  $(fragment).show( function(){
    $(fragment).addClass('display');
  });
}

LLMDInterpreter.prototype.run = function( atom ){
  
  if(this._pause) return null;
  var self = this;
  console.log( atom.name+" run "+this.ts.get() );
  
  // buffer next
  this.next();
  
  if( atom.renderWrapper() )
    this.render( atom );
  
  atom
    .executeWrapper(this.ctx.ctx)
    .then(function(){
      self.playerQue.test();
      self.buildQue.test();
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
    this.queueDep.depend();
    if( 0 in this.queue )
      return this.queue[0];
    else
      return null;
  }
  
  this.getLength = function(){
    this.queueDep.depend();
    return this.queue.length;
  }
  
  this.empty = function(){
    this.queueDep.depend();
    return this.queue.length == 0;
  };
  
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

CTX = function(ctx){
  this.ctx = ctx;
  this.ctxDep = new Deps.Dependency;
  this.get = function(){
    this.ctxDep.depend();
    return this.ctx;
    
  }
  this.change = function(){
    this.ctxDep.changed();
  }
  
  this.setContext = function( k, v ){
    this.ctx.context[k] = v;
    this.ctxDep.changed();
  }
}
