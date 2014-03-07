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
  console.log(this);
  var _id = this._id;
  this.fs.forEach( function( path ){
    context.push({
      _id: _id,
      path: path,
    });
  });
  return context;
}
