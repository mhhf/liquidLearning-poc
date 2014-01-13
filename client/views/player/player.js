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
