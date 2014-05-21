Courses.allow({
  insert: function(userId, doc){
    return !!userId;
  },
  update: function(){
    return true;
  },
  remove: function(){
    return true;
  }
});
