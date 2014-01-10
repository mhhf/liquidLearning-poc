// Packages structuraze the interactive Slides/ Image Generation on Presentation
PluginController = function(){
  
  var plugins = {};
  
  var loadPlugin= function( name, o ){
    
    // check if plugin don't exist yet
    if( plugins[name] ) return false;
    
    plugins[name] = o;
  }
}


// builds the slide structure based on markdown and packages
buildSlide = function( o ){
  var html = "";
  
  o.forEach( function( obj ){
    if( typeof obj == 'string' ) { // simple Markdown
      html = marked( obj );
    } else { // package
      console.log( obj );
      // look for package
      // compile html
      // prepare event listeners
      // talk to syncQue
    }
  });
  
  return html;
}
