MDPlugin = BasicPlugin.extend({
  render: function(){
    var divWrapper = document.createElement('span');
    divWrapper.innerHTML = marked( this.data );
    return divWrapper;
  }
});

PluginHandler.registerPlugin( "md", MDPlugin );
