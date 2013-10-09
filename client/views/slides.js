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

Template.page.rendered = function(){
	// TODO #slides #interaction: rewrite draggable and resizable to own handlers
	$('.staged').draggable().resizable();
}
