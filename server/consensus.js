Meteor.publish('consensus', function(){
  return Consensus.find();
});
