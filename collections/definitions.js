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

Atoms = new Meteor.Collection( 'atoms' );
Commits = new Meteor.Collection( 'commits' );

//
// name: <String>
// _commitId: <CommitId>
// type: ( tag | branch )
// _unitId: <UnitId>
//
LQTags = new Meteor.Collection('lq_tags');


// Dev
if (Meteor.isServer) {
  Meteor.publish('atoms', function(){
    return Atoms.find();
  });
  Meteor.publish('commits', function(){
    return Commits.find();
  });
  Meteor.publish('lq_tags', function(){
    return LQTags.find();
  });
  
}

if (Meteor.isClient) {
  Meteor.subscribe('atoms');
  Meteor.subscribe('commits');
  Meteor.subscribe('lq_tags');
}


