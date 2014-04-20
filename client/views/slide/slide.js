var lastBlock = 0;
Template.slide.rendered = function(e,t){
  
  var template = this;
  lastBlock = 0;
  
    Deps.autorun( function(e, t){
      
      var atom = interpreter.isPlaying();
      var scroll = template.find('#slideWrapper #scrollWrapper');
      var wrapper = template.find('#slideWrapper');
      
      if( $('img',wrapper).length > 0 )
        $('img',wrapper).load( function(){
          scrollDown( wrapper, scroll );
        });
    
      scrollDown( wrapper, scroll );
    });
}

scrollDown = function( wrapper, scroll ) {

  $(wrapper).stop().animate({
    scrollTop: ($(scroll).height()),
    duration: 800
  });
}
