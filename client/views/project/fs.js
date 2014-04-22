var currentDir = '/';
var currentDirDep = new Deps.Dependency;

var getcurrentDir = function(){
  currentDirDep.depend();
  return currentDir;
  
}

var setcurrentDir = function( val ){
  currentDir = val;
  currentDirDep.changed();
}


Template.fsView.getFsContext = function(){
  var context = [];
  var _id = this._id;
  this.head.forEach( function( obj ){
    context.push({
      _id: _id,
      path: obj.path,
      msg: obj.msg,
      date: new Date(obj.timestamp)
    });
  });
  return context;
}

Template.fsView.getDate = function(){
  return timeSince(this.date);
}

Template.fsView.events = {
  "click [name=newfilebtn]": function(e,t){
    e.preventDefault();
    
    var filename = t.find('[name=newfile]').value;
    
    if( !(filename.match(/\.lmd$/) || filename.match(/\.ljs/)) )
      return false;
    
    t.find('[name=newfile]').value = '';
    
    Meteor.call('saveFile', t.data._id ,{
      filepath: filename,
      md: '\n',
      commitMsg: 'new file'
    });
  }
}
