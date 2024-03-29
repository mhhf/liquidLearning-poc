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
    'sections.$.units.$._id': {
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
  Schemas.Common.LLMD
];

/*
 *  {
 *    _rootId: <_atomId>,
 *    _seedId: <_seedId>,
 *    parent: <_commitId>,
 *    date: <Data>, // auto value
 *    msg: <String>,
 *  }
 */

Schemas.Commit = [
  {
    _rootId: {
      type: String,
      autoValue: function(){
        if( this.isSet ) {
          return this.value;
        } else {
          var a = Atoms.insert( new LLMD.Atom('seq') );
          return a;
        }
      }
    },
    parent: {
      type: String,
      optional: true
    },
    date: {
      type: Date,
      autoValue: function(){
        return new Date();
      }
    },
    msg: {
      type: String,
      defaultValue: '',
      optional: true
    },
    _seedId: {
      type: String,
      autoValue: function(){
        if( this.isSet ) {
          return this.value;
        } else {
          return CryptoJS.SHA1(Math.random()+''+Math.random()).toString();
        }
      }
    }
  }
];

Schemas.LQTags = [
  {
    name: {
      type: String,
      defaultValue: 'master'
    },
    _commitId: {
      type: String,
      autoValue: function(){
        if( this.isInsert ) {
          
          var _cId = Commits.insert({});
          
          return _cId;
        }
      }
    },
    type: {
      type: String,
      autoValue: function(){
        if( !this.isSet ) {
          return 'tag';
        } else {
          return this.value;
        }
      }
    }
  }
];


Schemas.Units = [
  Schemas.Common.Owner,
  ACLInterface.schema,
  {
    _id: {
      type: String,
      autoValue: function(){
        if( this.isInsert ) {
          return Meteor.user().username+this.field('name').value.replace(/ /g,'_')
        }
      }
    },
    name: {
      type: String
    },
    nameId: {
      type: String,
      autoValue: function(){
        return this.field('name').value.replace(/ /g,'_');
      }
    },
    memberOf: {
      type:[String]
    },
    branch: {
      type: Object,
      autoValue: function(){
        if( this.isInsert ){
          
          var root = new LLMD.Atom('seq');
          var _rootId = Atoms.insert( root );

          var _commitId = Commits.insert({
            _rootId: _rootId,
            parent: null,
            _unitId: this.field('_id').value
          });
          
          var branch = LQTags.insert({
            name: 'master',
            type: 'branch',
            _commitId: _commitId,
            _unitId: this.field('_id').value
          });
          
          return {
            name: 'master',
            _id: branch 
          }
        }
      }
    },
    'branch.name': {
      type: String
    },
    'branch._id': {
      type: String
    }
  }
]
