var LocalFS = {
  _inited: false,
  op: null,
  root: null,
  
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
  
  start: function() {
    LocalFS.echo( "trying to get stored entry information for location\n" );
    chrome.storage.local.get( "savedpath", LocalFS.startWithPathID );
  },
  
  startWithPathID: function( o_items ) {
    console.log( o_items );
    if( !chrome.runtime.lastError ) {
      if( "savedpath" in o_items ) {
        LocalFS.echo( "our id for getting the path is: " + o_items["savedpath"], true );
        chrome.fileSystem.restoreEntry( o_items["savedpath"], LocalFS._startWithPath );
      } else {
        LocalFS.echo( "it worked but we have no saved path\n" );
      }
    } else {
      LocalFS.echo( ("error: " + chrome.runtime.lastError) );
    }
  },
  
  _startWithPath: function( o_entry ) {
    if( !chrome.runtime.lastError ) {
      LocalFS.root = o_entry;
      LocalFS.echo( "path has been set\n" );
      LocalFS._listFiles();
    } else {
      LocalFS.echo( "Error restoring item: " ).echo( chrome.runtime.lastError );
    }
  },
  
  echo: function( s_msg, b_nl ) {
    op.value += (s_msg + (b_nl ? "\n" : ""));
    op.setSelectionRange( op.value.length, op.value.length );
    return LocalFS;
  },
  
  setPath: function() {
    var opts = {
        "type": "openDirectory",
        "acceptsAllTypes": true
      };
    chrome.fileSystem.chooseEntry( opts, LocalFS._setPathCallback );
  },
  
  writeFile: function() {
    //
  },
  
  readFile: function() {
    //
  },
  
  
  _setPathCallback: function( o_entry, o_files ) {
    if( !chrome.runtime.lastError ) {
      //LocalFS.echo( "We were given " ).echo( entry ).echo( "\n" );
      LocalFS.echo( "it worked, we shall store it for later" );
      LocalFS.root = o_entry;       // root of our filesystem access
      LocalFS._saveStoragePath( o_entry );
      console.log( o_entry );
      console.log( o_files );
      LocalFS._listFiles();
    } else {
      LocalFS.echo( "it didn't work: " ).echo( chrome.runtime.lastError ).echo( "\n" );
    }
  },

  _saveStoragePath: function( o_entry ) {
      var stored_id = chrome.fileSystem.retainEntry( o_entry );
      LocalFS.echo( "our uid for the retain is: " ).echo( stored_id, true );
      chrome.storage.local.set( {"savedpath": stored_id}, LocalFS._saveStoragePathCallback );
  },
  
  _saveStoragePathCallback: function() {
    if( !chrome.runtime.lastError ) {
      LocalFS.echo( "we saved the path\n" );
    } else {
      LocalFS.echo( "failed to store path: " ).echo( chrome.runtime.lastError, true );
    }
  },
  
  _listFiles: function() {
    var reader = LocalFS.root.createReader();
    reader.readEntries( LocalFS._listFilesList, null );    // null is the for error handler, we just won't bother
  },
  
  _listFilesList: function( a_entries ) {
    for (var i = 0; i < a_entries.length; ++i) {
      var entry = a_entries[i];
      if( entry.isFile ) {
        console.log("entry is " + entry.fullPath);
      }
    }
  }
    

};


if( LocalFS.init() ) {
  LocalFS.start();
}
