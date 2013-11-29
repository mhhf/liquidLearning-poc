//
//
// TODO: write an image preloader which loads the images in the background
//
// TODO #editor: visualize:
//  * which slide is currently shown
//  * where are markdown errors
//  * where the slide begins and where it ends
//  * highlight the notes and the slide code
//
// holds the AST of the parsed Slides
var slides = null;
// pointer to the template scope
var _template;

var currentLine = -1;
var currentSlide = -1;

Template.editor.rendered = function(){
	// TODO #editor: allow to insert sync informations.
  // TODO #preview: always resize the preview with the ratio of 4/3
  
  _template = this;
	
	editor = CodeMirror(this.find('#editor'),{
		value: "",
		mode:  "markdown",
		lineNumbers: true,
		extraKeys: {"Ctrl-J": "autocomplete"}
	});

  // When the markup is changed
	editor.on('change', function(i,o){
    // Parse the markup
    parseSlides();
    // update the display
    // pick what to display
    positionHasChanged();
    // display it
    displaySlide();
	});
	
  editor.on('cursorActivity', function(i,o){
    if( positionHasChanged() ) { // and slide changed
      displaySlide(); // display the changed slide
    }
  });

};

// render the current slide to the preview
displaySlide = function( slide ){
  var html = slides[ slide == null?currentSlide:slide ].md;
  _template.find('#preview').innerHTML= marked( html );
}


// returns the current slide, which should be displayed
// this is triggered by the current cursor position in the editor
getSlide = function(){
  for (var i=0; i < slides.length; i++) {
    if( slides[i].from <= currentLine 
        && slides[i].to >= currentLine )
        return i;
  }
  return -1;
}

// Parse the slides to a AST
parseSlides = function(){
  slides = SlideParser.parse( editor.getValue() );
}

// updates the current line and current slide positions, 
// depending on the change of the current cursor position
// returns if the current slide has changed
positionHasChanged = function(){
  if ( currentLine != editor.getCursor().line+1 ) {// O(1)
    var _currentSlide = currentSlide;
    return _currentSlide != (currentSlide = getSlide( currentLine = editor.getCursor().line+1 )); // O(n)
  }
  return false;
}

Template.editor.events({
	"click button[name=play]" : function(){

		// Preprocess the text:
		// make an array of sentences
    //
    //
    // parse the slides again
    parseSlides(); // remove?

    var value = "";
    _.each(slides, function(slide){
      value += slide.notes+"\n";
    });
    // TODO #notes: export the split to the jison parser
		var s = value.replace(/\r\n|\n\r|\r|\n/g, '').split('.');
		s = _.filter(s, function(str){
			return !!str && str != "";
		});
		s = _.map(s, function(str){
			return str+'.';
		});

		Session.set('text',s);
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

		editor.setValue(val);
	}
});
