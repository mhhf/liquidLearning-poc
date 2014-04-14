// [TODO] - make template interactive - wait for the new rendering engine
PluginController.loadPlugin("multipleChoice", {
  template: 'pkg_multipleChoice',
  data: function( o ){
    
    // User has to specify a questions object
    if( o && o[0] && typeof o[0] == 'object' ) return o[0];
    else throw new Error('no questions specified');
    
    return null;
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
    console.log('buttton feetttt', this);
  }
};
