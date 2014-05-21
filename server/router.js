Router.map(function () {
  this.route('/upload', {
    where: 'server',
    action: function () {
      var request = this.request;
      var response = this.response;
      
      console.log(request, response);
      // do whatever
    }
  });
});
