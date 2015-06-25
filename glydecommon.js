var Glyde = {
  // utilties class
  
  startApp: function( s_webdef ) {
    // we are given a definition, this needs to be loaded
    var xhr = new XMLHttpRequest();
    xhr["glyde.webdef"] = s_webdef;
    xhr.onreadystatechange = Glyde._startAppWithWebDef;
    xhr.open( "GET", s_webdef, true );
    xhr.send();
console.log( "trying to download " + s_webdef );
  },
  
  _startAppWithWebDef: function() {
    // "this" will be the request
    if( this.readyState == 4 ) {    // OK
      if( this.status == 200 ) {
        // we need to know the app file we'll be using, parse the config and 
        //  then download the file pointed to by the "run" entry
        var config = Utils.parseSimpleConfig( this.responseText );
        if( config["run"] ) {
          var url = config["run"];
          if( url.charAt( 0 ) == "#" ) {
            url = chrome.runtime.getURL( url.substr( 1 ) );
          }
          var xhr = new XMLHttpRequest();
          xhr["glyde.webdef"] = this["glyde.webdef"];
          xhr.onreadystatechange = Glyde._startAppWithApp;
          xhr.open( "GET", url, true );
          xhr.send();
        } else {
          console.log( "_startAppWithWebDef: Invalid definition: " + this.responseText );
          console.log( config );
          // TODO: error: invalid definition
        }
      } else {
        console.log( "_startAppWithWebDef: Unable to download definition" );
        // TODO: error: unable to download definition
      }
    }
  },
  
  _startAppWithApp: function() {
    // "this" will be the request
    if( this.readyState == 4 ) {    // OK
      if( this.status == 200 ) {
        // we can now load the window information from the app file and open
        //  the window, passing control to it to load what it needs.
        var app = Glyde.App.create( this.responseText );
        var file = Glyde.App.getFile( app );
        var i = file.lastIndexOf( "/" );
        if( i > -1 ) {
          file = file.substr( i );                      // remove the path
        }
        if( file.substr( (file.length - 4) ) == ".app" ) {
          file = file.substr( 0, (file.length - 4) );   // remove the ".app"
        }
        var win = Glyde.App.getWindowDict( app );
        var bounds = { "width": 800, "height": 600 }, frame = {}, rnd = "";
        var sizable = true;
        if( Dict.containsKey( win, "chrome" ) ) {
          if( Dict.valueOf( win, "chrome" ).substr( 0, 2 ) == "no" ) {  // no|none|nothing
            frame["type"] = "none";
            sizable = false;
          }
        }
        if( Dict.containsKey( win, "left" ) ) {
          bounds["left"] = Dict.intValueOf( win, "left" );
          bounds["top"] = Dict.intValueOf( win, "top" );
          rnd += Math.random();      // ensures a different ID so previously saved location will not be used
        }
        if( Dict.containsKey( win, "width" ) ) {
          bounds["width"] = Dict.intValueOf( win, "width" );
          bounds["height"] = Dict.intValueOf( win, "height" );
          rnd += Math.random();      // ensures a different ID so previously saved location will not be used
        }
console.log( ('window: glydert.html#' + this["glyde.webdef"]) );
        chrome.app.window.create(
          ('glydert.html#' + encodeURIComponent( this["glyde.webdef"] )),
          {
            "id": (file + "window" + rnd),
            "innerBounds": bounds,
            "resizable": sizable,
            "frame": frame
          }
        );
      } else {
        // TODO: error: unable to load app definition
      }
    } else {
      // TODO: error: unable to load app definition
    }
  },
    
  App: {
    create: function( s_src ) {
      if( s_src === null ) {
        return null;
      }
			var e, s = 0;
			var key, value;
			var data = Dict.create(), vars = Dict.create();
			while( (e = s_src.indexOf( ";", s )) > -1 ) {
			  var line = s_src.substr( s, (e - s) ).trim();
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
    },
    
    getWindowDict: function( d_app ) {
      return Dict.createFromDictBranch( d_app, "window." );
    }
  }
};
