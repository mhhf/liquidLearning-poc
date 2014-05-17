Projects = new Meteor.Collection('projects', {
  schema: new SimpleSchema(Schemas.Project)
});

Consensus = new Meteor.Collection('consensus');

Units = new Meteor.Collection('units', {
  schema: new SimpleSchema(Schemas.Units)
});

Lectures = new Meteor.Collection( 'lectures', {
  schema: new SimpleSchema( Schemas.Lectures )
});


// Packages structuraze the interactive Slides/ Image Generation on Presentation
// Packages = new Meteor.Collection('packages');
