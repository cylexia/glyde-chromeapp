var GlydeLauncher = {
  _config: null,
  _inited: false,
  
	init: function() { "use strict";
	  if( !GlydeLauncher._inited ) {
		  GlydeLauncher._inited = true;
	    return true;
	  }
	  return false;
	},
	
	start: function() {
    // Load the config file and restart via the callback
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = GlydeLauncher.startWithConfig;
    xhr.open( "GET", chrome.runtime.getURL( "config.dat" ), true );
    xhr.send();
  },

	startWithConfig: function() {
    // "this" will be the request
    if( this.readyState == 4 ) {    // OK
      if( this.status == 200 ) {
        GlydeLauncher._config = Utils.loadSimpleConfig( this.responseText );
        GlydeLauncher.layoutLauncher();
      } else {
        // TODO: show an error page
      }
    }
	},
    
  layoutLauncher: function() {
      var apps = Utils.split( Dict.valueOf( GlydeLauncher._config, "app" ), "\n" );
      var launcher = _.e( "launcherview" );
      console.log( apps );
      return
      
    var files = GlueFileManager.listFiles( "" );    // "" is root path in this case, although all files are returned anyway...
    if( files ) {
      var apps = [], i, path;
      for( i = 0; i < files.length; i++ ) {
        path = files[i];
        if( path.substr( (path.length - 4) ) == ".app" ) {
          apps.push( path );
        }
      }
      if( (apps.length == 1) && Glyde.run_standalone ) {
        // we only have the one file, we'll just run it and forget the launcher
        Glyde.runApp( apps[0] );
        return;
      }
      if( apps.length > 0 ) {
        for( i = 0; i < apps.length; i++ ) {
          path = apps[i];
          var app = Glyde.App.create( GlueFileManager.readText( path ) );
          var el = _.c( "div",
              { "border": "1px solid black",
                  "margin-bottom": "2px",
                  "cursor": "pointer"
                },
              { "glyde.appfile": path }
            );
          var icon;
          var icon_src = GlueFileManager.readBinary( Glyde.App.getIconFile( app ) );
          if( icon_src ) {
            icon = icon_src;
          } else {
            icon = _.c( "img", {}, { "src": "assets/glyde128.png" } );
          }
          _.s( icon, { "width": "64px", "height": "64px", "vertical-align": "middle", "margin-right": "10px" } );
          el.appendChild( icon );
          el.appendChild( document.createTextNode( Glyde.App.getTitle( app ) ) );
          el.addEventListener( "click", Glyde._launchFromClick, false );
          launcher.appendChild( el );
        }
        // enable the back button and attach the handler
        var back = _.e( "tb_back" );
        _.s( back, { "display": "inline" } );
        back.addEventListener( "click", Glyde.reshowLauncher );
      } else {
        launcher.appendChild( document.createTextNode( "No Apps" ) );
      }
    } else {
      // TODO: warn unable to list files
    }    
	},
  		
  runApp: function( s_id ) {
    // reset the title of the runtime toolbar
		var tb_title = _.e( "tb_title" );
	  tb_title.removeChild( tb_title.childNodes[0] );
	  _.at( tb_title, "Glyde" );

    var app = Glyde.App.create( GlueFileManager.readText( s_id ) );
    if( app ) {
	    var script_file = Glyde.App.getScriptFile( app );
	    var main_script = GlueFileManager.readText( script_file );
	    if( main_script ) {
	      var vars = Glyde.App.getVarsMap( app );   // already an object/map so no need to convert
	    
	      // hide the launcher and make the runtime view visible
	      _.se( "launcherview", { "display": "none" } );
	      _.s( Glyde.getRuntimeDiv(), { "display": "block" } );

        ExtGlyde.reset();

	      //  TODO: "includes" need to be parsed and added to the start/end of the script
				Glue.load( Glyde.glue, main_script, vars );
				Glue.run( Glyde.glue );
	    } else {
	      // TODO: warn of unable to load script
	    }
    } else {
      // TODO: warn of unable to load app
    }
  },

  showLauncher: function() {
    var launcher = _.e( "launcherview" );
    var files = GlueFileManager.listFiles( "" );    // "" is root path in this case, although all files are returned anyway...
    if( files ) {
      var apps = [], i, path;
      for( i = 0; i < files.length; i++ ) {
        path = files[i];
        if( path.substr( (path.length - 4) ) == ".app" ) {
          apps.push( path );
        }
      }
      if( (apps.length == 1) && Glyde.run_standalone ) {
        // we only have the one file, we'll just run it and forget the launcher
        Glyde.runApp( apps[0] );
        return;
      }
      if( apps.length > 0 ) {
        for( i = 0; i < apps.length; i++ ) {
          path = apps[i];
          var app = Glyde.App.create( GlueFileManager.readText( path ) );
          var el = _.c( "div",
              { "border": "1px solid black",
                  "margin-bottom": "2px",
                  "cursor": "pointer"
                },
              { "glyde.appfile": path }
            );
          var icon;
          var icon_src = GlueFileManager.readBinary( Glyde.App.getIconFile( app ) );
          if( icon_src ) {
            icon = icon_src;
          } else {
            icon = _.c( "img", {}, { "src": "assets/glyde128.png" } );
          }
          _.s( icon, { "width": "64px", "height": "64px", "vertical-align": "middle", "margin-right": "10px" } );
          el.appendChild( icon );
          el.appendChild( document.createTextNode( Glyde.App.getTitle( app ) ) );
          el.addEventListener( "click", Glyde._launchFromClick, false );
          launcher.appendChild( el );
        }
        // enable the back button and attach the handler
        var back = _.e( "tb_back" );
        _.s( back, { "display": "inline" } );
        back.addEventListener( "click", Glyde.reshowLauncher );
      } else {
        launcher.appendChild( document.createTextNode( "No Apps" ) );
      }
    } else {
      // TODO: warn unable to list files
    }
  },
  
  _launchFromClick: function( o_evt ) {
    // as this is an event handler "this" will point to the element calling it
    if( this["glyde.appfile"] ) {
      var file = this["glyde.appfile"];
      Glyde.runApp( file );
    }
  },
			
  App: {
    create: function( s_src ) {
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

// Initialise and start the request for the config
if( GlydeLauncher.init() ) {
  GlydeLauncher.start();
}
