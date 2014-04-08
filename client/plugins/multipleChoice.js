// [TODO] - make template interactive - wait for the new rendering engine
PluginController.loadPlugin("multipleChoice", {
  getFragment: function( obj ){
    var html = "";
    
    var tmp = Template.pkg_multipleChoice.render(obj);
    var docFragment = Meteor.render( tmp );
    
    
    return docFragment;
  }
});

Template.pkg_multipleChoice.answer = function(){
 return Session.get('answer');
}

Template.pkg_multipleChoice.events = {
  "change input": function(e,t){
    e.preventDefault();
    console.log( 'fetttt' );
  },
  "click button": function(e,t){
    e.preventDefault();
    console.log('buttton feetttt');
  }
};
