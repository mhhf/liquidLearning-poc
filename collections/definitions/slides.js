Slides = new Meteor.Collection('slides');

if(Meteor.isClient)
	Meteor.subscribe('slides');

if(Meteor.isServer)
	Meteor.publish('slides', function(){
		return Slides.find();	
	});

