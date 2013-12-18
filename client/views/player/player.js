Template.player.rendered = function(){
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

Template.slidesDisplay.currentSlide = function(){
  var pointer = syncQue.getPointer();
    
  if( syncQue && syncQue.getElement().slideIndex in this.ast ) {
    var html = this.ast[ syncQue.getElement().slideIndex ].md;
    return marked( html );
  }
  return '';
}

