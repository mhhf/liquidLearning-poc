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


// [TODO] - build only the last block and leave other untouched
// [TODO] - export Markdown to a plugin so building happens only via plugins
// builds the slide structure based on markdown and packages
buildSlide = function( o ){
  var frag;
  var fragment = document.createElement('div');
  
  o.forEach( function( obj ){
    if( typeof obj.md == 'string' ) { // simple Markdown
      var divWrapper = document.createElement('span');
      divWrapper.innerHTML = marked( obj.md );
      fragment.appendChild( divWrapper );
    } else if( typeof obj.package == 'string' ){ // package
      var packageObject =  JSON.parse( obj.data );
      
      // look for package
      var plugin = PluginController.getPlugin( obj.package );
      if( !plugin ) return false;
      
      // compile html
      
      frag = plugin.getFragment( packageObject );
      fragment.appendChild( frag );
      
      // prepare event listeners
      // talk to syncQue
    }
  });
  
  return fragment;
}
