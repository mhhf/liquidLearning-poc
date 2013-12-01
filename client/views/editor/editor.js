Template.editor.rendered = function(){

};


Template.editor.events({
	"click button[name=play]" : function(){

    var slides = InstantPreview.getSlides();

    // collect all notes
    var notes = [];
    _.each(slides, function(slide){
      notes = notes.concat( slide.notes );
    });

		Session.set('text',notes);
    Session.set('slides', slides);

		Router.go('player');
	},
	"change select" : function(e,t){
		
		var val;
		switch(e.target.value) {
			case "0": // none
				val = '';
				break;
			case "1": // lsd
				val = 'LSD is the best known and most researched psychedelic.\nIt is the standard against which all other psychedelics are compared.\nIt is active at extremely low doses and is most commonly available on blotter or in liquid form.';
				break;
      case "2":
        val = '## slide 1\n text 1  \n text 2\n???\nnotes 1.1\nnotes 1.2\n---	\n## slide 2\n * point 1\n * point 2\n???\nnotes 2.1\nnotes 2.2';
        break;
      case "3":
        val = '## LSD\n* best known\n* standart\n???\nLSD is the best known and most researched psychedelic.\nIt is the standard against which all other psychedelics are compared.\n---\n## Active\n* low dosis\n \n![lsd](http://www.thefix.com/sites/default/files/styles/article/public/bicycle%20blotter.jpeg?itok=wb8U8OIH)\n???\nIt is active at extremely low doses and is most commonly available on blotter or in liquid form.';
        break;
			default:
				val = '';
		}

    InstantPreview.setMarkdown( val );
	}
});
