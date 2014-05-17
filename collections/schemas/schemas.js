Schemas.Units = [
  {state: {
    type: String,
    defaultValue: 'ready'
  }},
  ACLInterface.schema,
  Schemas.Common.Owner,
  Schemas.Common.Git,
  Schemas.Common.Stars,
  Schemas.Common.LLMD,
  Schemas.Common.Activity,
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

Schemas.Lectures = [
  Schemas.Common.Owner,
  Schemas.Common.Stars,
  Schemas.Common.Activity,
  Schemas.Common.Common,
  ACLInterface.schema
];
