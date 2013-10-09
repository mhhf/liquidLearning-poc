Template.preview.helpers({
	slide: function(){
		console.log("sad");
		return Slides.findOne();	
	}
});

Template.previewSlide.helpers({
	image: function(){
		return this.type == "image";	
	}
});
