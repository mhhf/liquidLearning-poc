Deps.autorun( function(){
  var data = Session.get( 'data' );
  if(InstantPreview && data ) InstantPreview.setMarkdown( data );
});

Template.projectEdit.events = {
  "click a.save": function(e,t){
    e.preventDefault();
    var md = InstantPreview.getMarkdown();
    var slides = InstantPreview.getSlides();
    //
    // [todo] - ACL
    Meteor.call('saveFile', this._id, { 
      md: md,
      'slidesLength': slides.length
    });
  }
}
