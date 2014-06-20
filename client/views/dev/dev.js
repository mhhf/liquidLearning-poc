Template.devNew.events = {
  "click .save-btn": function(e,t){
    var atom = _.extend(new LLMD.Atom('redisc'), this.buildAtom() );
    var _atomId = Atoms.insert(atom);
    Router.go('devPost', {
      _id: _atomId
    });
  }
}
