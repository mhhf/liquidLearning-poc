Meteor.publish('text', function(text){
	
	console.log(text);

	return Syncs.find();
})
