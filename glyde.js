// "use strict";

var Glyde = {
		canvas: null,
		glue: {},
		
		init: function() { "use strict";
			Glue.init( Glyde.glue );
			window.addEventListener( "load", Glyde.start );
			
			return true;
		},
			
		start: function() { "use strict";
			Glyde.canvas = document.getElementById( "test" );
			Glyde.canvas.addEventListener( "click", Glyde.click );

			VecText.init();
			ExtGlyde.init( Glyde.canvas );
				
			Glue.attachPlugin( Glyde.glue, ExtGlyde );
				
			document.getElementById( "test_girls" ).addEventListener( "click", Glyde.testGirls );
		},
		
	  testGirls: function() {
	    var app = Glyde.App.create( GlueFileManager.readText( "com_test_girls.app" ) );
	    var script_file = Glyde.App.getScriptFile( app );
	    var main_script = GlueFileManager.readText( script_file );
	    var vars = Glyde.App.getVarsMap( app );   // already an object/map so no need to convert
	    
	    // TODO: includes need to be parsed and added to the start/end of the script
				Glue.load( Glyde.glue, main_script, vars );
				Glue.run( Glyde.glue );
	    
	  },

		click: function( e ) { "use strict";
				e = (e || window.event);
				
				var label = Glyde._getIdAtEventPoint( e );

        if( label ) {
          Glue.run( Glyde.glue, label );
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

  loadApp: function( s_id ) {
    var src = GlueFileManager.readText( s_id );
    if( src !== null ) {
      console.log( src );
    }
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
				if( e > -1 ) {
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


