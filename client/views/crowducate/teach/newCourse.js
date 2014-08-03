var editorView = {};

var image = {
  dep:	new Deps.Dependency,
  val: null,
  get: function(){
    this.dep.depend();
    return this.val;
  },
  set: function( val ){
    this.dep.changed();
    this.val = val;
  }
}

Template.newCourse.helpers({
  editorDep: function(){
    return editor;
  },
  getBuilder: function(){
    return editorView;
  },
  uploadedImage: function(){
    var img = Images.findOne({_id: image.get() });
    return img && img.isUploaded();
  },
  imageUrl: function(){
    var img = Images.findOne({_id: image.get() });
    return img.url();
  }
});

Template.newCourse.events = {
  "submit": function(e,t){
    e.preventDefault();
    var baseUrl = 'http://ll-poc.s3.amazonaws.com/img/';
    
    var name = t.find('#name').value;
    var tags = this.newtags || []; 
    var description = editorView.build();
    var i = Images.findOne(image.get());
    var imgUrl = baseUrl + i._id + i.name();
    
    console.log('haha');
    Meteor.call('newCourse', {
      name: name,
      thumbnail: imgUrl,
      tags: tags,
      description: description
    }, function(err, succ){
      if(!err)
        Router.go('teach');
      else
        console.log(err);
    });
    
  },
  "dragenter #dropzone": function(e,t){
    e.stopPropagation();
    e.preventDefault(); 
    
    $('#dropzone').addClass('hover');
  },
  "dragleave #dropzone": function(e,t){
    e.stopPropagation();
    e.preventDefault(); 
    
    // $('#dropzone').removeClass('hover');
  },
  "dragover #dropzone": function(e,t){
    e.stopPropagation();
    e.preventDefault(); 
  },
  "drop #dropzone": function(e,t){
    
    e.stopPropagation();
    e.preventDefault(); 
    
    $('#dropzone').removeClass('hover');
    
    var files = e.originalEvent.dataTransfer.files;
    var file = new FS.File(files[0]);
    
    var i = Images.insert(file, function(err, succ){ 
      console.log(err,succ);
    });
    
    image.set(i._id);
    console.log(image.get());
    
  }
}

Template.newCourse.rendered = function(){
}
