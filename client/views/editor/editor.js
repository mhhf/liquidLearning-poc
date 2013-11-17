var parsedSlides = null;
var self;

Template.editor.rendered = function(){
	// TODO #editor: allow to insert sync informations.
  
  self = this;
	
	editor = CodeMirror(this.find('#editor'),{
		value: "",
		mode:  "markdown",
		lineNumbers: true,
		extraKeys: {"Ctrl-J": "autocomplete"}
	});

	editor.on('change', function(i,o){
    parsedSlides = slideParser.parse( i.getValue() );
    currentLine = i.getCursor().line+1;
    currentSlide = getSlide( currentLine ); 
    displaySlide( currentSlide );
	});
	
  var currentLine = -1;
  var currentSlide = -1;
  editor.on('cursorActivity', function(i,o){
    if( currentLine != i.getCursor().line+1 // Cursor on different line
        && currentSlide != getSlide( currentLine = (i.getCursor().line+1)) ) {
          displaySlide( currentSlide = (getSlide( currentLine )) )
        }
  });

};

displaySlide = function( slide ){
  var html = parsedSlides[slide].md;
  self.find('#preview').innerHTML= marked( html );
}

getSlide = function( cursorLine ){
  for (var i=0; i < parsedSlides.length; i++) {
    if( parsedSlides[i].from <= cursorLine 
        && parsedSlides[i].to >= cursorLine )
        return i;
  }
  return -1;
}


Template.editor.events({
	"click button[name=play]" : function(){

		// Preprocess the text:
		// make an array of sentences
		// TODO write a jison compiler which extracts the presentation
		// and the text
		var s = editor.getValue().replace(/\r\n|\n\r|\r|\n/g, '').split('.');
		s = _.filter(s, function(str){
			return !!str && str != "";
		});
		s = _.map(s, function(str){
			return str+'.';
		});
		
		console.log(s);
		Session.set('text',s)
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
			default:
				val = '';
		}

		editor.setValue(val);
	}
});
