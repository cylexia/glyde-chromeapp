var Start = {
  _root: '',
  _inited: false,
  _files: [],       // list of files we need to load
  
  init: function() {
    if( !Start._inited ) {
      GlueFileManager.init();   // we will be saving our files here
      // the hash contains the url we are loading from, this must either be
      //  a directory or point to "config.glyde"
      var u = document.location.hash.substr( 1 );
      if( u.substr( (u.length - 12) ) == "config.glyde" ) {
        u = u.substr( 0, (u.length - 12) );   // remove "config.glyde"
      }
      Start._root = u;
      Start._inited = true;
    }
    return true;
  },
  
  showPage: function() {
    // "waiting" is visible, we get the config file then can show some
    //  more information about the app.  All files get stored in 
    //  GlueFileManager's storage
    
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = Start._downloadConfigCallback;
    xhr.open( "GET", (Start._root + "config.glyde"), true );
    xhr.send();
  },
  
  // Load the configuration from the given source
  _loadConfig: function( s_src ) {
    var conf = Utils.loadSimpleConfig( s_src );
    // we will now 
    var apps = Utils.split( Dict.valueOf( conf, "apps" ), "\n" );
    
    
    
    
    Start._files = [];
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
				    
		      case "script":
				     Start._files.push( {
				        "file": (Start._root + path + value), 
				        "name": (path + alias),
				        "type": key
				      } );
				    break;
  			  case "image":
console.log( "binary: " + (path + alias) + " = " (Start._root + path + value) );
  			    GlueFileManager.setResource( (path + alias), (Start._root + path + value) );
  			    break;
				}
			}
		}
  },
  
	_getNextFile: function() {
	  if( Start._files.length > 0 ) {
	    var f = Start._files.pop();
	    if( f["type"] == "text" ) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = Start._storeFile, f );
        xhr.open( "GET", f["file"], true );
        xhr.send();
	    } else if( f["type"] == "script" ) {
	      var s = document.createElement( "script" );
	      s.src = f["file"];
	      document.getElementsByTagName( "head" )[0].appendChild( s );
	      // target script must call "FS.notifyLoaded( s_name )"
	    }
	  } else {
	    FS._done_callback.call( this );
	  }
	},
	

  _downloadConfigCallback: function() {
   // "this" points to the request since that sent the event
    if( this.readyState == 4 ) {    // OK
      if( this.status == 200 ) {
        GlueFileManager.writeText( "config.glyde", this.responseText );
        Start._loadConfig( this.responseText );
      } else {
        FS._loadFileFailed( this["x-data"] );
      }
    }
  
}