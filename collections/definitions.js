Projects = new Meteor.Collection('projects', {
  schema: new SimpleSchema(Schemas.Project)
});

Consensus = new Meteor.Collection('consensus');

Units = new Meteor.Collection('units', {
  schema: new SimpleSchema(Schemas.Units)
});

Courses = new Meteor.Collection( 'courses', {
  schema: new SimpleSchema( Schemas.Courses )
});


// Packages structuraze the interactive Slides/ Image Generation on Presentation
// Packages = new Meteor.Collection('packages');
