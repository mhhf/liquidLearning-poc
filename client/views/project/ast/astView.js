
Template.projectAstView.rendered = function(){
  var wrapper = this.find('ul');
  
  var ast = this.data.ast;
  var atom,fragment, plugin;
  for(var i in ast) {
    atom = ast[i];
    fragment = document.createElement('li');
    fragment.className = 'atomWrapper';
    plugin = new PluginHandler.plugin[atom.name](atom, this.data.ctx);
    plugin.buildWrapper({context:this.data.ctx}, true);
    
    UI.insert( UI.renderWithData( getTemplate( plugin ), plugin ), fragment  );
    
    wrapper.appendChild( fragment );
    
  }
}

getTemplate = function(p){
  if(p && p.astTemplate)
    return Template[p.astTemplate];
  else if( p.name == 'md' )
    return Template['pkg_md_view'];
  else
    return Template['astDefaultDisplay'];
}
