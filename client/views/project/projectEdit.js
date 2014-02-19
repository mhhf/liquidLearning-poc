// holds the AST of the parsed Slides
var slides = null;
var value = "";

// pointer to the template scope
var _template;

var currentLine = -1;
var currentSlide = -1;

var editor;
var init = false;

Template.projectEdit.destroyed = function(){
  editor = null;
  init = false;
}

Template.projectEdit.rendered = function(){
  
  // init needet due to own plugin injection
  if(!init) {
    init = true;
    _template = this;
    
    value = this.data.data;

    if(!editor) {
      editor = CodeMirror(this.find('#editor'),{
        value: value,
        mode:  "markdown",
        lineNumbers: true,
        extraKeys: {"Ctrl-J": "autocomplete"}
      });

      // When the markup is changed
      editor.on('change', function(i,o){
        // Parse the markup
        parseLlmd();
        // update the display
        // pick what to display
        positionHasChanged();
        // display it
        displaySlide();
      });
      
      // [FIXME] - clean initial state
      editor.on('cursorActivity', function(i,o){
        if( positionHasChanged() ) { // and slide changed
          displaySlide(); // display the changed slide
        }
      });
    }
    if(value) {
      parseLlmd();
      positionHasChanged();
      displaySlide();
    }
  }
}

Template.projectEdit.events = {
  "click a.save": function(e,t){
    e.preventDefault();
    
    var _id = this._id;
    
    bootbox.prompt("What did you changed?", function(result) {                
      if (result === null) {                                             
        
      } else {
        var md = editor.getValue();
        var slides = parseLlmd();
        //
        // [todo] - feedback
        Meteor.call('saveFile', _id, { 
          md: md,
          ast: slides,
          slidesLength: slides.length,
          commitMsg: result
        });
      }
    }); 
    
  },
  "click a.preview": function(e, t){
    e.preventDefault();
    
    var _id = this._id;
    
    // [TODO] - check if need to save: hash the md and check if hash has changed
    // [TODO] - check if need to build : hash the md and check if hash has changed
    Meteor.call('buildProject', _id, function(err){
      if ( !err ) {
        Router.go('projectPreview',{ _id: _id });
        return null;
      }
      console.log('err');
    });
  },
  "click a.saveReadyBtn": function(e, t){
    e.preventDefault();
    
    var msg = t.find('#xlInput').value();
    console.log(msg);
  }
}



// render the current slide to the preview
var displaySlide = function( slide ){
  var slide = window.slide;
  var ast = slides[ slide == null?currentSlide:slide ].md;
  var fragment = buildSlide( ast ) ;
  var previewWrapper = _template.find('#preview');
  previewWrapper.innerHTML = '';
  previewWrapper.appendChild ( fragment );
}

// returns the current slide, which should be displayed
// this is triggered by the current cursor position in the editor
var getSlide = function(){
  for (var i=0; i < slides.length; i++) {
    if( slides[i].from <= currentLine 
        && slides[i].to >= currentLine )
        return i;
  }
  return -1;
}

// Parse the slides to a AST
var parseLlmd = function(){
  slides = LlmdParser.parse( editor.getValue() );
  return slides;
}

// updates the current line and current slide positions, 
// depending on the change of the current cursor position
// returns if the current slide has changed
var positionHasChanged = function(){
  if ( currentLine != editor.getCursor().line+1 ) {// O(1)
    var _currentSlide = currentSlide;
    return _currentSlide != (
      currentSlide = getSlide( currentLine = editor.getCursor().line+1 )
      ); // O(n)
  }
  return false;
}
