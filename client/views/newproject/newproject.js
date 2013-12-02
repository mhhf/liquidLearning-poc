Template.newproject.events = {
  "submit": function(e,t){
    e.preventDefault();
    var name = t.find('input[name=name]').value;
    var description = t.find('input[name=description]').value;
    var public = t.find('input[name=public]').checked;

    Meteor.call('newProject', {
      name: name,
      description: description,
      public: public
    });
  }
}
