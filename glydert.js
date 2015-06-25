// "use strict";

var GlydeRT = {
		canvas: null,
		glue: {},
    _app_file: "",
    
		init: function() { "use strict";
			Glue.init( GlydeRT.glue );
			window.addEventListener( "load", GlydeRT.start );
			return true;
		},
		
		start: function() { "use strict";
//			var b = document.createElement( "button" );
//			b.appendChild( document.createTextNode( "start" ) );
//			b.addEventListener( "click", GlydeRT.start0 );
//			document.getElementsByTagName( "body" )[0].appendChild( b );
//		},
		
//		start0: function() {
		  // since we're doing our own widgets we need to make them work
		  var idx = 0, w;
		  while( (w = _.e( ("widget_close" + idx) )) ) {
        w.addEventListener( "click", GlydeRT._closeWindow, false );
	      _.e( ("widget_minimise" + idx) ).addEventListener( "click", GlydeRT._minimiseWindow, false );
        idx++;
      }
		  // we need the config, load it and pass on to next method
		  // TODO: a "loading" box?
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = GlydeRT.startWithWebDef;
      xhr.open( "GET", decodeURIComponent( document.location.hash.substr( 1 ) ), true );
      xhr.send();
    },
  
  	startWithWebDef: function() {
      // "this" will be the request
      if( this.readyState == 4 ) {    // OK
        if( this.status == 200 ) {
          var webdef = Utils.parseSimpleConfig( this.responseText );
          // get all the files we need together and load them...
          var download = [], i;
          var scripts = Utils.split( Dict.valueOf( webdef, "script" ), "\n" );
          for( i = 0; i < scripts.length; i++ ) {
            download.push( ("script=" + scripts[i] + ";") );
          }
          download.push( ("text=" + webdef["run"] + ";") );
          if( webdef["root"] ) {
            download.push( ("path=" + webdef["root"] + ";") );
          }
          var types = [ "text", "image" ], typei;
          for( typei = 0; typei < types.length; typei++ ) {
            var files = Utils.split( Dict.valueOf( webdef, types[typei] ), "\n" );
            for( i = 0; i < files.length; i++ ) {
              download.push( (types[typei] + "=" + files[i] + ";") );
            }
          }
          // load the file list and pass control to the next stage
          GlydeRT._app_file = webdef["run"];
          FS.init();
          FS.loadFileSystemFromString( download.join( "\n" ), GlydeRT.startWithFileSystem );
        } else {
          // TODO: show an error page
        }
      }
  	},
		
    startWithFileSystem: function() {
			GlydeRT.canvas = document.getElementById( "content" );
			GlydeRT.canvas.addEventListener( "click", GlydeRT._clickHandler, false );

			VecText.init();
			ExtGlyde.init( GlydeRT.canvas );
			
			Glue.attachPlugin( GlydeRT.glue, ExtGlyde );
			
			GlydeRT.runApp( GlydeRT._app_file );
//			var b = document.createElement( "button" );
//			b.appendChild( document.createTextNode( "start" ) );
//			b.addEventListener( "click", GlydeRT.runApp0 );
//			document.getElementsByTagName( "body" )[0].appendChild( b );
//		},
//
//    runApp0: function() {
//      GlydeRT.runApp( GlydeRT._app_file );
    },

	  runApp: function( s_appfile ) {
      // reset the title of the runtime toolbar
			var tb_title = _.e( "tb_title" );
		  tb_title.removeChild( tb_title.childNodes[0] );
		  _.at( tb_title, "Glyde" );
	    var app = Glyde.App.create( GlueFileManager.readText( s_appfile ) );
	    if( app ) {
  	    var script_file = Glyde.App.getScriptFile( app );
  	    var main_script = GlueFileManager.readText( script_file );
  	    if( main_script ) {
  	      var vars = Glyde.App.getVarsMap( app );   // already an object/map so no need to convert
  	    
  	      //  TODO: "includes" need to be parsed and added to the start/end of the script
  				Glue.load( GlydeRT.glue, main_script, vars );
  				GlydeRT._showRuntime();
  				Glue.run( GlydeRT.glue );
  	    } else {
  	      // TODO: warn of unable to load script
  	    }
	    } else {
	      // TODO: warn of unable to load app
	    }
	  },

  getRuntimeDiv: function() {
    return _.e( "runtimeview" );
  },
  
  _showRuntime: function() {
    _.se( "loadview", { "display": "none" } );
    _.se( "runtimeview", { "display": "block" } );
  },

  /** Event handling **/
	_clickHandler: function( e ) { "use strict";
		e = (e || window.event);
		
		var label = GlydeRT._getIdAtEventPoint( e );

    if( label ) {
      Glue.run( GlydeRT.glue, label );
    }				
	},
	
  _getIdAtEventPoint: function( o_evt ) { "use strict";
		var rect = GlydeRT.canvas.getBoundingClientRect();
		var x = Math.round( ((o_evt.clientX - rect.left) / (rect.right - rect.left) * GlydeRT.canvas.width) );
		var y = Math.round( ((o_evt.clientY - rect.top) / (rect.bottom - rect.top ) * GlydeRT.canvas.height) );
		return ExtGlyde.getLabelForButtonAt( x, y );
  },
  
  _minimiseWindow: function() {
    chrome.app.window.current().minimize();
  },
  
  _closeWindow: function() {
    chrome.app.window.current().close();
  }
};

// Setup Core, Glue and the file system.  Attaches Glyde.start() to window.onload
// At this point ExtGlyde is NOT available - becomes available after start()
GlydeRT.init();


