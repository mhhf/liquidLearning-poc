Template.player.rendered = function(){
}

Template.player.events({
	"click button[name=stop]" : function(){
		Router.go('editor');
	},
	"click button[name=play]" : function(){
		syncQue.startPlay();
	},
});
