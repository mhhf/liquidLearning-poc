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
  "click [name=next]": function(){
    var t = interpreter.playerQue.top();
    if( (t.name == "???" || t.name == 'wait') && t.isBlocked()  )
      t.unblock();
  }
});
Template.player.pause = function(){
  return interpreter.isPause();
}

Template.player.nextable = function(){
  var t = interpreter.playerQue.top();
  return t && ( ( interpreter.getOption('mute') && t.name == "???" ) || t.name == 'wait') && t.isBlocked() ;
}

Template.subtitles.tts = function(t,a){
  (!this.tts) && (this.tts = []);
  var ttsO = this.mediaHandler.getElement();
  ttsO && this.tts.push(ttsO);
  return this.tts;
}

Template.subtitles.rendered = function(){
  
  var self = this;
  Meteor.autorun( function(){
    var ttsO = self.data.mediaHandler.getElement();
    
    var currentDisplay = self.find('.subtitles ul li:last-child');
    if(!currentDisplay) return false;
    
    var top = $(currentDisplay).position().top;
    
    $('.subtitles ul').css('top',-top);
    
  });
  
}
