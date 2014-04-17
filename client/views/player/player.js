Template.player.events({
	"click [name=back]" : function(){
	},
	"click [name=stop]" : function(){
	},
	"click [name=pause]" : function(){
    interpreter.togglePause(true);
	},
	"click [name=play]" : function(){
    interpreter.togglePause(false);
	},
});
Template.player.pause = function(){
  return interpreter.isPause();
}

Template.subtitles.tts = function(t,a){
  (!this.tts) && (this.tts = []);
  var ttsO = this.syncQue.getElement();
  ttsO && this.tts.push(ttsO);
  return this.tts;
}

Template.subtitles.rendered = function(){
  
  var self = this;
  Meteor.autorun( function(){
    var ttsO = self.data.syncQue.getElement();
    
    var currentDisplay = self.find('ul li:last-child');
    if(!currentDisplay) return false;
    
    var top = $(currentDisplay).position().top;
    
    $('ul').css('top',-top);
    
  });
  
}
