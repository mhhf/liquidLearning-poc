ACL = function( o ){
  if( !o || !o.acl ) throw new Error('Not an aclable element');
  
  
  var checkUser = function( userId, right ){
    var userAcl = _.find( o.acl, function(e){
      return e._id == userId;
    });
    if( !userAcl ) return false;

    if( !userRightToNumber( userAcl.right ) >= userRightToNumber( right ) )
      throw new Error('User dont have the permission to do this action');
    
    return pubInterface;
  }

  var addUser = function( username, right, cb ){
    
    // look for user in the database
    var user = Meteor.users.findOne({ username: username });
    
    // if no user found or user is self then exit
    if( !user || user._id == Meteor.userId() ) 
      throw new Error('User not found');
    
    var acl = o.acl;
    if( _.find( o.acl, function(e){ return e._id == user._id; }) ) {
      acl = _.filter( o.acl, function(e){ return e._id != user._id; });
    }
    
    acl.push({
      _id: user._id,
      name: user.username,
      right: right
    });
    
    cb( acl );
    
    return this;
  }

  var removeUser = function( userId ){
    
    var newAcl = _.filter(project.acl, function(e){ return e._id != userId; });
    
    return this;
  }
    
  var pubInterface = {
    check: function( right ){
      return checkUser( Meteor.userId(), right );
    },
    checkUser: checkUser,
    addUser: addUser,
    removeUser: removeUser
  };
  
  return pubInterface;
}

var userRightToNumber = function( right ){
  return right=='admin'?3:(right=='write'?2:1);
}


