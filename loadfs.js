var FS = {
  _inited: false,
  _files: [],
  _done_callback: null,
  _root: "",
  
  init: function( s_root ) {
    if( FS._inited === true ) {
      return;
    }
    FS._root = s_root;
    FS._inited = true;
    return true;
  },
  
  loadFileSystem: function( s_listfile, f_callback ) {
    FS._done_callback = f_callback;
    FS._makeRequest( s_listfile, FS._loadFileSystemCallback );
  },
  
  _makeRequest: function( s_file, f_callback, x_data ) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = f_callback;
    xhr.open( "GET", chrome.runtime.getURL( s_file ), true );
    xhr["x-data"] = x_data;
    xhr.send();
  },
  
  _loadFileSystemCallback: function() {
    // "this" points to the request since that sent the event
    if( this.readyState == 4 ) {    // OK
      if( this.status == 200 ) {
        FS._loadFileList( this.responseText );
        FS._getNextFile();
      } else {
        FS._loadFileFailed( this["x-data"] );
      }
    }
  },
  
  _loadFileList: function( s_src ) {
    FS._files = [];
		var e, s = 0;
		var key, value, alias, path = "";
		while( (e = s_src.indexOf( ";", s )) > -1 ) {
		  var line = s_src.substr( s, (e - s) ).trim();
		  s = (e + 1);
			e = line.indexOf( "=" );
			if( (e > -1) && (line.length > 0) && (line.charAt( 0 ) != "#") ) {
				key = line.substring( 0, e );
				value = line.substring( (e + 1) );
				if( (e = value.indexOf( ">" )) > -1 ) {
				  alias = value.substr( (e + 1) ).trim();
				  value = value.substr( 0, e ).trim();
				} else {
				  alias = value;
				}
				switch( key ) {
				  case "path":
			      path = value;
				    break;
				   case "text":
				     FS._files.push( {
				        "file": (FS._root + path + value), 
				        "name": (path + alias),
				        "type": key
				      } );
				    break;
  			  case "image":
  			    Glyde.storeBinaryFile( (path + alias), (FS._root + path + value) );
  			    break;
				}
			}
		}
  },
  
	_getNextFile: function() {
	  if( FS._files.length > 0 ) {
	    var f = FS._files.pop();
	    FS._makeRequest( f["file"], FS._storeFile, f );
	  } else {
	    FS._done_callback.call( this );
	  }
	},
	
	_storeFile: function() {
    // "this" points to the request since that sent the event
    if( this.readyState == 4 ) {    // OK
      var def = this["x-data"];
      Glyde.storeRawTextFile( def["name"], this.responseText );
      FS._getNextFile();
    }
  },
    
  _loadFileFailed: function( m_data ) {
    console.log( "failed to load file: " + m_data["file"] );
  }
  
};