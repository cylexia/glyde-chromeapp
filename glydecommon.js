var Glyde = {
  // utilties class
  
  startApp: function( o_app ) {
    var file = Glyde.App.getFile( o_app );
    var i = file.lastIndexOf( "/" );
    if( i > -1 ) {
      file = file.substr( i );                      // remove the path
    }
    if( file.substr( (file.length - 4) ) == ".app" ) {
      file = file.substr( 0, (file.length - 4) );   // remove the ".app"
    }
    chrome.app.window.create(
      ('glydert.html#' + file),
      {
        id: (file + "window"),
        bounds: {width: 800, height: 600},
        resizable: false,
        frame: {
          //type: "none"
        }
      }
    );
  },
  
  App: {
    create: function( s_file ) {
      var src = GlueFileManager.readText( s_file );
      if( src === null ) {
        return null;
      }
			var e, s = 0;
			var key, value;
			var data = Dict.create(), vars = Dict.create();
			Dict.set( data, "_file", s_file );
			while( (e = src.indexOf( ";", s )) > -1 ) {
			  var line = src.substr( s, (e - s) ).trim();
			  s = (e + 1);
				e = line.indexOf( "=" );
				if( (e > -1) && (line.length > 0) && (line.charAt( 0 ) != "#") ) {
					key = line.substring( 0, e );
					value = line.substring( (e + 1) );
					if( key == "var" ) {
    				e = value.indexOf( "=" );
    				if( e > -1 ) {
    					Dict.set( vars, value.substring( 0, e ), value.substring( (e + 1) ) );
    				}
					} else {
					  Dict.set( data, key, value );
					}
				}
			}
			Dict.set( data, "var_dict", vars );
      return data;
    },
    
    getFile: function( d_app ) {
      return Dict.valueOf( d_app, "_file" );
    },
  
    getTitle: function( d_app ) {
      return Dict.valueOf( d_app, "title" );
    },
    
    getScriptFile: function( d_app ) {
      return Dict.valueOf( d_app, "script" );
    },
  
    getIconFile: function( d_app ) {
      return Dict.valueOf( d_app, "icon" );
    },
    
    getIncludeFiles: function( d_app ) {      // comma separated list? or multiple include keys makes an array/indexed dict?
      return Dict.valueOf( d_app, "include" );
    },
    
    getVarsMap: function( d_app ) {   // Dict
      return Dict.valueOf( d_app, "var_dict" );
    }
  }
};
