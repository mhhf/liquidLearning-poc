// [TODO] - simplify with the new rendering engine
var init = false;
Template.slide.rendered = function(e,t){
  
  var template = this;
  
  console.log(init);
  if( !init ) {
    // init = true;
    Deps.autorun( function(e, t){
      
      var pointer = syncQue.getPointer();

      if( !( syncQue && syncQue.getElement().slideIndex in template.data.ast ) ) 
        return false;
      
      
      // [TODO] - rename md to slideObject
      // 
      var currentSlide = syncQue.getElement().slideIndex;
      
      var ast = _.filter(template.data.ast.slice(0,currentSlide+1), function(block){
        return block.exp == null;
      });
      
      var fragment = buildSlide( ast );
      var wrapper = template.find('#slideWrapper');
      wrapper.innerHTML = '';
      wrapper.appendChild( fragment );
    });
  }
}
