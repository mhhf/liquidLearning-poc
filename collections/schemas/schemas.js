// [TODO] - fucking ged rid of units -> units just files in the coruse structure
Schemas.Project = [
  { state: {
      type: String,
      defaultValue: 'ready'
  } },
  ACLInterface.schema,
  ActivityInterface.schema,
  Schemas.Common.Owner,
  Schemas.Common.Git,
  Schemas.Common.Stars,
  Schemas.Common.LLMD,
  Schemas.Common.Common
];

Schemas.Courses = [
  Schemas.Common.Owner,
  Schemas.Common.Stars,
  Schemas.Common.Common,
  ActivityInterface.schema,
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
    'sections.$.index': {
      type: String
    },
    'sections.$.units': {
      type: [Object]
    },
    'sections.$.units.$.name': {
      type: String
    },
    'sections.$.units.$.index': {
      type: Number
    }
  },
  {state: {
    type: String,
    defaultValue: 'ready'
  }},
  Schemas.Common.Git,
  Schemas.Common.LLMD,
];
