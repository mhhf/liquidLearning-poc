Template.slides.helpers({
	slide: function(){
		console.log("sad");
		return Slides.findOne();	
	}
});

Template.page.helpers({
	image: function(){
		return this.type == "image";	
	}
});
