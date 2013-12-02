Projects = new Meteor.Collection('projects');

Syncs = new Meteor.Collection('syncs');

Feedback = new Meteor.Collection('feedback');

if( Meteor.isServer ) {
  Meteor.publish('feedback', function(){
    return Feedback.find({});
  });
}
if( Meteor.isClient ) {
  Meteor.subscribe('feedback');
}
