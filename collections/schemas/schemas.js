// [TODO] - fucking ged rid of units -> units just files in the coruse structure
Schemas.Units = [
  {state: {
    type: String,
    defaultValue: 'ready'
  }},
  Schemas.Common.Git,
  Schemas.Common.LLMD,
  Schemas.Common.Activity,
  ACLInterface.schema,
  Schemas.Common.Owner,
  Schemas.Common.Stars,
  Schemas.Common.Common
];


Schemas.Project = [
  { state: {
      type: String,
      defaultValue: 'ready'
  } },
  ACLInterface.schema,
  Schemas.Common.Owner,
  Schemas.Common.Git,
  Schemas.Common.Stars,
  Schemas.Common.LLMD,
  Schemas.Common.Activity,
  Schemas.Common.Common
];

Schemas.Courses = [
  Schemas.Common.Owner,
  Schemas.Common.Stars,
  Schemas.Common.Activity,
  Schemas.Common.Common,
  ACLInterface.schema,
  {
    thumbnail: {
      type: String,
    },
    tags: {
      type: [String],
      defaultValue: []
    },
    sections: {
      type: [Object],
      defaultValue: []
    },
    'sections.$.name': {
      type: String
    },
    'sections.$.units': {
      type: [Schemas.Units]
    }
  }
];
