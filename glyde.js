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
	    // should load the app definition here to extract the sources needed, we just go with the main one
				Glue.load( Glyde.glue, GlueFileManager.readText( "com.test.girls/main.script" ), {} );
				Glue.run( Glyde.glue );
	    
	  },

		click: function( e ) { "use strict";
				e = (e || window.event);
				
				var label = Glyde._getIdAtEventPoint( e );

        if( label ) {
          Glue.run( Glyde.glue, label );
        }				
			},
			
  loadApp: function( s_id ) {
    var src = GlueFileManager.readText( s_id );
    if( src !== null ) {
      console.log( src );
    }
  },
  
  _getIdAtEventPoint: function( o_evt ) { "use strict";
		var rect = Glyde.canvas.getBoundingClientRect();
		var x = Math.round( ((o_evt.clientX - rect.left) / (rect.right - rect.left) * Glyde.canvas.width) );
		var y = Math.round( ((o_evt.clientY - rect.top) / (rect.bottom - rect.top ) * Glyde.canvas.height) );
		return ExtGlyde.getLabelForButtonAt( x, y );
  }
};

// Setup Core, Glue and the file system.  Attaches Glyde.start() to window.onload
// At this point ExtGlyde is NOT available - becomes available after start()
Glyde.init();


