Template.projectEdit.rendered = function(){
  if( this.data.data )
    InstantPreview.setMarkdown( this.data.data );
}

Template.projectEdit.events = {
  "click a.save": function(e,t){
    e.preventDefault();
    var md = InstantPreview.getMarkdown();
    var slides = InstantPreview.getSlides();
    //
    // [todo] - feedback
    Meteor.call('saveFile', this._id, { 
      md: md,
      ast: slides,
      'slidesLength': slides.length
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
    
  }
}
