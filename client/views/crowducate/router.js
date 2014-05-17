Router.map( function(){
  
  this.route('learn');
  this.route('teach', {
    waitOn: function(){
      return Meteor.subscribe('ownLectures');
    },
    data: function(){
      return {
        lectures: Lectures.find()
      };
    }
  });
  
  this.route( 'newCourse', {
    waitOn: function(){
      return Meteor.subscribe('tags');
    },
    data: {
      tags: Tags.find()
    }
  });
  
});
