Projects = new Meteor.Collection('projects');

Syncs = new Meteor.Collection('syncs');

Feedback = new Meteor.Collection('feedback');

// Packages structuraze the interactive Slides/ Image Generation on Presentation
// Packages = new Meteor.Collection('packages');

if( Meteor.isServer ) {
  Meteor.publish('feedback', function(){
    return Feedback.find({});
  });
}
if( Meteor.isClient ) {
  Meteor.subscribe('feedback');
}


