var LocalFS = {
  _inited: false,
  op: null,
  
  init: function() {
    if( !LocalFS._inited ) {
      op = _.e( "output" );
      _.e( "setpath" ).addEventListener( "click", LocalFS.setPath );
      _.e( "writefile" ).addEventListener( "click", LocalFS.writeFile );
      _.e( "readfile" ).addEventListener( "click", LocalFS.readFile );
      LocalFS._inited = true;
    }
    return true;
  },
  
  setPath: function() {
    //
  },
  
  writeFile: function() {
    //
  },
  
  readFile: function() {
    //
  }
};
