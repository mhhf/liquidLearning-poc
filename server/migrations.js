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
