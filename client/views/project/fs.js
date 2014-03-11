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
