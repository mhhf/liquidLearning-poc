var _currentSlide = -1;
var _template;
Template.player.rendered = function(){
  _template = this;
  // [TODO] - free from autorun
  
  Deps.autorun( function(){
    // FIXME: da fuck is this called 4 times in a row with the same value
    if(syncQue.getElement())
    var text = syncQue.getElement().text;
    var slides = _template.data.ast;
    var slideNumber = -1;
    for (var i=0; i < slides.length; i++) {
      if( slides[i].notes.indexOf( text ) > -1 ) {
        slideNumber = i;
        break;
      }
    }
    if( slideNumber != _currentSlide ) {
      _currentSlide = slideNumber;
      showSlide(_template.data.ast);
    }
    
  });
}

Template.player.events({
	"click [name=back]" : function(){
		syncQue.stop();
    Router.go('editor');
	},
	"click [name=stop]" : function(){
		syncQue.stop();
	},
	"click [name=pause]" : function(){
		syncQue.pause();
		// syncQue.startPlay();
	},
	"click [name=play]" : function(){
		syncQue.play();
	},
});

showSlide = function( ast ){
  // if( _currentSlide in ast ) {
  //   var html = ast[ _currentSlide ].md;
  //   _template.find('#slideWrapper').innerHTML= marked( html );
  // }
}

Template.slidesDisplay.currentSlide = function(){
  var pointer = syncQue.getPointer();
    
  if( _currentSlide in this.ast ) {
    var html = this.ast[ _currentSlide ].md;
    return marked( html );
  }
  return '';
}

