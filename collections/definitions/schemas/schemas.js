Schemas.Project = new SimpleSchema([{
  hash: {
    type: String
  },
  stars: {
    type: [String],
    defaultValue: []
  },
  ast: {
    type: [Object],
    blackbox: true
  },
  'ast.$': {
    type: Object,
    blackbox: true
  },
  language: {
    type: String
  },
  activity: {
    type: [Object],
    defaultValue: [],
    blackbox: true
  },
  'activity.$': {
    type: Object,
    blackbox: true
  },
  name: {
    type: String
  },
  description: {
    type: String
  },
  head: {
    type: [Object],
    blackbox: true
  },
  'head.$': {
    type: Object,
    blackbox: true
  },
  ctx: {
    type: Object,
    blackbox: true
  },
  state: {
    type: String,
    defaultValue: 'ready'
  },
  public: {
    type: Boolean
  }
},
Schemas.Common.ACL,
Schemas.Common.Owner
]);
