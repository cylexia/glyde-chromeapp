// "use strict";

var GlydeRT = {
		canvas: null,
		glue: {},

		init: function() { "use strict";
			Glue.init( GlydeRT.glue );
			window.addEventListener( "load", GlydeRT.start );

			return true;
		},
			
		start: function() { "use strict";
		  // since we're doing our own widgets we need to make them work
		  var idx = 0, w;
		  while( (w = _.e( ("widget_close" + idx) )) ) {
        w.addEventListener( "click", GlydeRT._closeWindow, false );
	      _.e( ("widget_minimise" + idx) ).addEventListener( "click", GlydeRT._minimiseWindow, false );
        idx++;
      }
      
			GlydeRT.canvas = document.getElementById( "content" );
			GlydeRT.canvas.addEventListener( "click", Glyde._clickHandler, false );

			VecText.init();
			ExtGlyde.init( GlydeRT.canvas );
			
			Glue.attachPlugin( GlydeRT.glue, ExtGlyde );

			if( FS ) {
			  FS.init( "/fs/" );
			  FS.loadFileSystem( "/fs/files.lst", GlydeRT.showLauncher );
			} else {
			  Glyde.showLauncher();
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
	
  _getIdAtEventPoint: function( o_evt ) { "use strict";
		var rect = Glyde.canvas.getBoundingClientRect();
		var x = Math.round( ((o_evt.clientX - rect.left) / (rect.right - rect.left) * Glyde.canvas.width) );
		var y = Math.round( ((o_evt.clientY - rect.top) / (rect.bottom - rect.top ) * Glyde.canvas.height) );
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


