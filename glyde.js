// "use strict";

var Glyde = {
		canvas: null,
		glue: {},
		run_standalone: false,    // true: if only one app exists it's run instead of the launcher being shown
		
		init: function() { "use strict";
			Glue.init( Glyde.glue );
			window.addEventListener( "load", Glyde.start );
			
			return true;
		},
			
		start: function() { "use strict";
			Glyde.canvas = document.getElementById( "test" );
			Glyde.canvas.addEventListener( "click", Glyde._clickHandler, false );

			VecText.init();
			ExtGlyde.init( Glyde.canvas );
			
			Glue.attachPlugin( Glyde.glue, ExtGlyde );

      // to delay launch uncomment the below line (and the 5 at end)
      //var df = function() {
			if( FS ) {
			  FS.init( "/fs/" );
			  FS.loadFileSystem( "/fs/files.lst", Glyde.showLauncher );
			} else {
			  Glyde.showLauncher();
			}
      //};
			//var b = _.c( "button" );
			//b.addEventListener( "click", df, false );
			//b.appendChild( document.createTextNode( "manual launch" ) );
			//_.e( "launcherview" ).appendChild( b );
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
  
  reshowLauncher: function() {
    _.se( "launcherview", { "display": "block" } );
    _.se( "runtimeview", { "display": "none" } );
  },
  
  getRuntimeDiv: function() {
    return _.e( "runtimeview" );
  },
  
  /** Event handling **/
	_clickHandler: function( e ) { "use strict";
			e = (e || window.event);
			
			var label = Glyde._getIdAtEventPoint( e );

      if( label ) {
        Glue.run( Glyde.glue, label );
      }				
		},
	
  _launchFromClick: function( o_evt ) {
    // as this is an event handler "this" will point to the element calling it
    if( this["glyde.appfile"] ) {
      var file = this["glyde.appfile"];
      Glyde.runApp( file );
    }
  },
			
	/** File support **/
	storeTextFile: function( s_path, a_data ) {
	  return Glyde._pushFile( s_path, a_data.join( "\n" ) );
	},

	storeRawTextFile: function( s_path, s_data ) {
	  return Glyde._pushFile( s_path, s_data );
	},

	storeBinaryFile: function( s_path, s_datasrc ) {
	  return Glyde._pushFile( s_path, s_datasrc, true );
	},

  _pushFile: function( s_path, x_data, b_binary ) {
	  // TODO: this needs to track added files so it can launch once all are available?
    return GlueFileManager.setResource( s_path, x_data, b_binary );
  },
  
  _getIdAtEventPoint: function( o_evt ) { "use strict";
		var rect = Glyde.canvas.getBoundingClientRect();
		var x = Math.round( ((o_evt.clientX - rect.left) / (rect.right - rect.left) * Glyde.canvas.width) );
		var y = Math.round( ((o_evt.clientY - rect.top) / (rect.bottom - rect.top ) * Glyde.canvas.height) );
		return ExtGlyde.getLabelForButtonAt( x, y );
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

// Setup Core, Glue and the file system.  Attaches Glyde.start() to window.onload
// At this point ExtGlyde is NOT available - becomes available after start()
Glyde.init();


