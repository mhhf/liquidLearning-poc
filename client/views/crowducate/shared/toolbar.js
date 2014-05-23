Template.editToolbar.helpers({
  needBuild: function(){
    return (this.data && this.data.state == "changed")?'needBuild':'';
  }
});
