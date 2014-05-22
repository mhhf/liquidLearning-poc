var path = process.env.LLWD;

GitInterface = {
  schema: null,
  
  apply: function ( o ){
    o.openFile = function( file ){
      return Git.openFile( path + this.ele.hash + '/' + file );
    };
    o.commit = function( msg, md, file ) {
      Git.commit( msg, path + this.ele.hash, md, file);
      
      var headState = Git.buildTree( path + this.ele.hash );
      
      this.Collection.update({ _id: this.ele._id },{
        $set: { 
          state: 'changed',
          head: headState
        }
      });
    },
    o.removeRepo = function(){
      Git.remove( path + this.ele.hash );
    }
  }
}
