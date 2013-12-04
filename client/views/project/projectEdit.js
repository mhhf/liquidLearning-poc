Deps.autorun( function(){
  var data = Session.get( 'data' );
  if(InstantPreview && data ) InstantPreview.setMarkdown( data );
});

Template.projectEdit.events = {
  "click a.save": function(e,t){
    e.preventDefault();
    var data = InstantPreview.getMarkdown();
    Meteor.call('saveFile', this.hash, data );
  }
}
