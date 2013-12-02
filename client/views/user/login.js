Template.login.events = {
  'submit': function(e,t){
    e.preventDefault();

    switch(e.srcElement.id) {
      case "form-login":
        var user = t.find('input[name=user]').value;
        var pass = t.find('input[name=password]').value;
        Meteor.loginWithPassword(user,pass, function( e, o ){
          if( !e ) Router.go('/')
        });
        break;
    }
  }
}
