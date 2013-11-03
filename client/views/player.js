Template.player.rendered = function(){

	var syncQue = new SyncQue({
		text: Session.get('text')
	});

	syncQue.loadSounds( Syncs.find().fetch(), function(err, buffer){
		syncQue.startPlay( buffer );
	});
}

Template.player.events({
	"click button[name=stop]" : function(){
		Router.go('editor');
	}
});
