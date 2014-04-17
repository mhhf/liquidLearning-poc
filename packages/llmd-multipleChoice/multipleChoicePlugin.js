MSPlugin = BasicPlugin.extend({
  render: function(){
    var divWrapper = document.createElement('span');
    divWrapper.innerHTML = marked( 'YOO PLUGIN YOO' );
    return divWrapper;
  }
});

PluginHandler.registerPlugin( "multipleChoice", MSPlugin );
