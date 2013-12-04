Template.projectNew.events = {
  "submit": function(e,t){
    e.preventDefault();
    var name = t.find('input[name=name]').value;
    var description = t.find('input[name=description]').value;
    var public = t.find('input[name=public]').checked;

    // [TODO] - provide feedback before data is sent to the server
    // [TODO] - provide feedback after server response
    var id = Meteor.call('projectNew', {
      name: name,
      description: description,
      public: public
    }, function( err, suc ){
      if( err ) console.log(err);
      if( suc && suc.id ) Router.go( '/project/edit/'+suc.id );
    });

  }
}
