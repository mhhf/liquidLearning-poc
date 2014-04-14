// Packages structuraze the interactive Slides/ Image Generation on Presentation
PluginControllerClass = function(){
  
  var plugins = {};
  
  var loadPlugin= function( name, o ){
    
    // check if plugin don't exist yet
    if( plugins[name] ) return false;
    
    plugins[name] = o;
  }
  
  var getPlugin = function( name ){
    return plugins[ name ];
  }
  
  return {
    getPlugin: getPlugin,
    loadPlugin: loadPlugin
  }
}
PluginController = new PluginControllerClass();


// builds the slide structure based on markdown and packages
buildSlide = function( o ){
  var frag;
  var fragment = document.createElement('div');
  
  o.forEach( function( obj ){
    
    if( obj.name == 'md' ) { // simple Markdown
      var divWrapper = document.createElement('span');
      divWrapper.innerHTML = marked( obj.data );
      fragment.appendChild( divWrapper );
    } else if( obj.name == 'pkg' ){ // package
      
      // look for package
      var plugin = PluginController.getPlugin( obj.name );
      if( !plugin ) return false;
      
      var packageObject = plugin.data( obj.opt );
      
     UI.insert( UI.renderWithData( Template[ plugin.template ], packageObject ), fragment ); 
      
      // frag = plugin.getFragment( packageObject );
      // fragment.appendChild( frag );
      
      // prepare event listeners
      // talk to syncQue
    }
  });
  // [TODO] - extend with type=block
  
  return fragment;
}
