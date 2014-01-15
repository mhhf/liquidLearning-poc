// [TODO] - simplify with the new rendering engine
var init = false;
Template.slide.rendered = function(e,t){
  
  var template = this;
  
  if( !init ) {
    init = true;
    Deps.autorun( function(e,t){
      
      var pointer = syncQue.getPointer();

      if( !( syncQue && syncQue.getElement().slideIndex in template.data.ast ) ) 
        return false;
      
      
      // [TODO] - rename md to slideObject
      var html = template.data.ast[ syncQue.getElement().slideIndex ].md;
      var fragment = buildSlide( html );
      var wrapper = template.find('#slideWrapper');
      wrapper.innerHTML = '';
      wrapper.appendChild( fragment );
    });
  }
}
