BasicPlugin = function( ){
  this._block = true;
  this._run = false;
  this._build = false;
  this._container = false;
};

BasicPlugin.prototype._loaded = false;
BasicPlugin.prototype.load = function(){
  this._loaded = true;
  return {then:function(cb1,cb2){cb1(true);}};
}
BasicPlugin.prototype.execute = function(){
  this._block = false;
}
BasicPlugin.prototype.build = function(ctx){
  return true;
}

BasicPlugin.prototype.buildWrapper = function(ctx){
  var self = this;
  self._build = true;
  
  return this.build(ctx);
  
}

// [TODO] - rename init to loading?
BasicPlugin.prototype.loadingWrapper = function(ctx){
  
  var self = this;
  return new Promise(function(resolve) {

    self.load.apply(self, [ctx, function(){
      
      self._loaded = true;
      resolve();
    }]);

  });
}

// TODO: timeout?
BasicPlugin.prototype.executeWrapper = function(execute){
  
  this._run = true;
  var self = this;
  
  this.domNode = this.render && this.render();
  execute();
  
  return new Promise( function(resolve){
    
    self.execute.apply( self, [ function(){
      self.unblock();
      resolve()
    }] );

  });
  
};


BasicPlugin.prototype.isLoaded = function(){
  return this._loaded;
}
BasicPlugin.prototype.isRun = function(){
  return this._run;
}
BasicPlugin.prototype.isBuild = function(){
  return this._build;
}

BasicPlugin.prototype.isUnblocked = function(){
  return !this._block;
}

BasicPlugin.prototype.block = function(){
  this._block = true;
}
BasicPlugin.prototype.unblock = function(){
  this._block = false;
}




BasicPlugin.extend = function(properties){
  var Plugin = function( o ){
    for(var k in o) {
      this[k] = o[k];
    }
  }
  Plugin.prototype = new BasicPlugin();
  
  for(var k in properties ) {
    Plugin.prototype[k] = properties[k];
  }
  
  return Plugin;
}
