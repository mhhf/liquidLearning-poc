MDPlugin = BasicPlugin.extend({
  render: function(){
    var divWrapper = document.createElement('div');
    divWrapper.innerHTML = marked( this.data );
    return divWrapper;
  }
});

PluginHandler.registerPlugin( "md", MDPlugin );
