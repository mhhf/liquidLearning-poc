// [TODO] - simplify with the new rendering engine
var init = false;
var lastBlock = 0;
Template.slide.rendered = function(e,t){
  
  var template = this;
  
  if( !init ) {
    init = true;
    Deps.autorun( function(e, t){
      
      // SyncQue must be loaded
      // ???
      if( !( syncQue && syncQue.getElement().slideIndex in template.data.ast ) ) 
        return false;
      
      // [TODO] - rename md to slideObject
      // 
      var currentSlide = syncQue.getElement().slideIndex;
      var wrapper = template.find('#slideWrapper');
      // check if block was already placed
      if( $('#block_'+currentSlide,wrapper).length > 0 )
        return false;
      
      
      var ast = _.filter(template.data.ast.slice( lastBlock, currentSlide ), function(block){
        return block.type != 'block' || block.name != '???';
      });
      
      var fragment = buildSlide( ast );
      // wrapper.innerHTML = '';
      fragment.setAttribute('style', 'display:none;');
      fragment.setAttribute('id', 'block_'+currentSlide );
      window.fragment = fragment;
      wrapper.appendChild( fragment );
      $(fragment).fadeIn({});
      
      if( $('img',fragment).length > 0 )
        $('img',fragment).load( function(){
          scrollDown( wrapper, fragment.offsetTop + fragment.offsetHeight - 400 );
        });
      scrollDown( wrapper, fragment.offsetTop + fragment.offsetHeight - 400 );
      
      lastBlock = currentSlide;
    });
  }
}

scrollDown = function( wrapper, to ) {
  $(wrapper).stop().animate({
    scrollTop: to,
    duration: 800
  });
}
