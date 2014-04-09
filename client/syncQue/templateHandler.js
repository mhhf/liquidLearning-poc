Template.loadingIndicator.ttsObject = function(){
	return syncQue.getSoundQueue();
}

Template.loadingIndicator.rendered = function(){
}

// mark the current blob as active
// mark the current line as active
Template.loadingIndicator.playing = function(){
  return this.i == syncQue.getPointer()?'playing':'';
}

// align the top position of the subtitles
Template.loadingIndicator.getMargin = function(){
  return -20*syncQue.getPointer();
}

