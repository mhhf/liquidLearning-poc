FS.debug = false;

S3Store = new FS.Store.S3("images", {
    region: "us-west-2", 
    bucket: "ll-poc",
    folder: 'img',
    ACL: 'public-read',
    transformWrite: function(f,r,w){
      var size = {width: 200, height: 200};
      
      gm(r,f.name())
      .resize(size.width * 2, (size.height * 2) + '')
      .thumbnail(size.width, size.height + '^')
      .gravity('Center')
      .extent(size.width, size.height)
      .profile('*')
      .stream()
      .pipe(w);
    }
  });

Images = new FS.Collection("images", {
  stores: [S3Store]
});

Images.allow({
  insert: function(userId) {
    return !!userId;
  },
  update: function(userId) {
    return !!userId;
  },
  remove: function(userId) {
    return !!userId;
  },
  download: function(userId) {
    return true;
  },
  fetch: []
});
