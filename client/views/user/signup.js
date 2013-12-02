Template.signup.events = {
  "submit": function(e,t){
    e.preventDefault();
    var user = t.find('input[name=user]').value;
    var email = t.find('input[name=email]').value;
    var pass = t.find('input[name=pass]').value;
    var pass2 = t.find('input[name=pass2]').value;

    if( pass == pass2 )
      Accounts.createUser({
        username: user,
        email: email,
        password: pass
      }, function( e, o ){
        console.log("dafuck",e,o);
      });
  }
}
