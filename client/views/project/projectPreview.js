Template.projectPreview.loading = function(){
  return interpreter.isLoading().toString();
}


Template.projectPreview.playing = function(){
  var atom = interpreter.isPlaying();
  return atom && atom.name;
}


