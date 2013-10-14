Slides = new Meteor.Collection('slides');
Syncs = new Meteor.Collection('syncs');

if(Meteor.isClient)
	Meteor.subscribe('slides');

if(Meteor.isServer)
	Meteor.publish('slides', function(){
		return Slides.find();	
	});

