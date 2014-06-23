Migrations.add({
  version: 2,
  up: function() {
    
    var c;
    while( c = Commits.findOne( {rootId: {$exists: true}} )) {
      Commits.update({ _id: c._id },{ 
        $set:{_rootId: c.rootId},
        $unset: {rootId:''}
      })
    }
    
    while( c = Commits.findOne( { previous: {$exists: true} } )){
      Commits.update({ _id: c._id },{
        $set: { parent: c.previous },
        $unset: { previous: '' }
      });
    }
  }
});


Migrations.add({
  version: 4,
  up: function() {
    
    var a;
    while( a = Atoms.findOne( {_atomId: {$exists: true}} )) {
      Atoms.update({ _id: a._id },{ 
        $set:{_seedId: a._atomId},
        $unset: {_atomId:''}
      })
    }
  }
});
