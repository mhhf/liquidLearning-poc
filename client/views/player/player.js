var _currentSlide = -1;
var _template;
Template.player.rendered = function(){
  _template = this;
  Deps.autorun( function(){
    // FIXME: da fuck is this called 4 times in a row with the same value
    if(syncQue.getElement())
    var text = syncQue.getElement().text;
    var slides = Session.get('slides');
    var slideNumber = -1;
    for (var i=0; i < slides.length; i++) {
      if( slides[i].notes.indexOf( text ) > -1 ) {
        slideNumber = i;
        break;
      }
    }
    if( slideNumber != _currentSlide ) {
      _currentSlide = slideNumber;
      showSlide();
    }
    
  });
}

Template.player.events({
	"click [name=stop]" : function(){
		syncQue.stop();
		Router.go('editor');
	},
	"click [name=pause]" : function(){
		syncQue.pause();
		// syncQue.startPlay();
	},
	"click [name=play]" : function(){
		syncQue.play();
	},
});

showSlide = function(){
  var slides = Session.get('slides');
  var html = slides[ _currentSlide ].md;
  _template.find('#slideWrapper').innerHTML= marked( html );
}
