Router.map( function(){
  this.route('dev', {
    waitOn: function(){
      return Meteor.subscribe('consensus');
    },
    data: function(){
      return Consensus.find({});
    } 
  });
});
