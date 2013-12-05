var state = 'general';
var stateDep = new Deps.Dependency;
var getState = function(){
  stateDep.depend();
  return state;
  
}
var setState = function( val ){
  state = val;
  stateDep.changed();
}


Template.memberSettings.acls = function(){
  return this.acl;
}

Template.projectSettings.isState = function( val ){
  return val == getState()?'selected':false;
}

Template.projectSettings.events = {
  "click a.menueBtn.general" : function(){
    setState('general');
  },
  "click a.menueBtn.members" : function(){
    setState('members');
  },
  "click a.menueBtn.delete" : function(){
    setState('delete');
  }
}

Template.generalSettings.events = {
  "click button[name=submit]": function(e,t){
    e.preventDefault();
    
    var name = t.find('input[name=name]').value;
    var description = t.find('input[name=description]').value;
    var public = t.find('input[name=public]').checked;

    Meteor.call('updateProjectSettings',{
      projectId: this._id,
      name: name,
      description: description,
      public: public
    });
    
  }   
}

Template.memberSettings.events = {
  "click button[name=add]" : function(e,t){
    e.preventDefault();

    var user = t.find('input[name=user]').value;
    var right = t.find('select').value;

    t.find('input[name=user]').value = '';

    Meteor.call('addUserToProject', {
      projectId: this._id, 
      user: user,
      right: right
    });
  },
  "click button[name=remove]": function(e,t){
    e.preventDefault();

    Meteor.call('removeUserFromProject', {
      projectId: t.data._id,
      userId: this._id
    });
  }
}

Template.deleteProject.events = {
  "click button[name=delete]" : function(e,t){
    e.preventDefault();
    Meteor.call('deleteProject',this._id, function(err, succ){
      if( succ ) Router.go('/');
    });
  }
}
