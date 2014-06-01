var astModel = null;

ASTModel = function( selector ){
  
  var self = this;
  this.atomModels = [];
  var atomDeps = new Deps.Dependency;
  
  var unit = Units.findOne( selector );
  if( !unit ) throw new Error('wtf?');
  var _id = unit._id;
  
  
  var setupAtom = function( atomModel ){
      atomModel.onChange( function( atom, index ){
        var obj = {};
        obj['ast.'+index] = atom;
        Units.update({_id: _id}, {$set: obj});
      });
      atomModel.onRemove( function( atom, index ){
        Units.update({_id: _id}, {$pull: {'ast':atom} });
      });
      self.atomModels.push( atomModel );
  } 
  
  // init
  if( !self.ast ) {
    unit.ast.forEach( function( a, i ){
      var atomModel = new AtomModel( a, i, false );
      setupAtom( atomModel );
    });
  }
  
  $.extend(self, unit);
  
  this.getAtoms = function(){
    atomDeps.depend();
    return this.atomModels;
  }
  
  this.add = function( atom ){
    
    var index = this.ast.length;
    var atomModel = new AtomModel( atom, index, true );
    setupAtom( atomModel );
    Units.update({_id: _id},{$push: {ast: atom}});
    atomDeps.changed();
  }
  
  // changeIndex
  
}


Template.editLLMD.created = function(){
  astModel = new ASTModel( {name: this.data.lectureName} );
}

Template.editLLMD.helpers({
  atoms: function(){
    return astModel.getAtoms();
  },
  astModel: function(){
    return astModel;
  }
});


Template.editLLMD.rendered = function(){
  console.log(this.data);
  new Sortable(this.find('#editorContainer'), {
    handle: '.sort-handle',
    onUpdate: function(e,a){
      var oldPos = e.srcElement.dataset.index;
      var newPos = e.srcElement.previousElementSibling && e.srcElement.previousElementSibling.dataset.index - 1 || 0;
      var parent = e.srcElement.parentElement;
      console.log(e);
    }
  });
}

