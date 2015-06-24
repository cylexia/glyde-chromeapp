
var GlueTestSuite = {
  _inited: false,
  
  init: function() {
    if( !GlueTestSuite._inited ) {
      GlueFileManager.init();           // needed for platform's file system commands
      GluePlatform.setExecApp( "test.exe", GlueTestSuite );    // register our "test.exe"
      GlueTestSuite._inited = true;
    }
    return true;
  },
  
  start: function() {
    document.getElementById( "run" ).addEventListener( "click", GlueTestSuite.runScript, false );
    GlueTestSuite._addTestLoadButton( "Core", "/glue-tests/core.test" );
    GlueTestSuite._addTestLoadButton( "ExtPlatform", "/glue-tests/platform.test" );
  },

  runScript: function() {
    document.getElementById( "out" ).value = "";
    var script = document.getElementById( "in" ).value;
    var g = {};
    Glue.init( g );
    Glue.setStdOut( GlueTestSuite._goutput );
    Glue.load( g, script );
    Glue.run( g );
  },

  _goutput: function( s_str ) {
    document.getElementById( "out" ).value += s_str;
  },

  _addTestLoadButton: function( s_label, s_file ) {
    var b = document.createElement( "button" );
    b["script.file"] = s_file;
    b.appendChild( document.createTextNode( s_label ) );
    b.addEventListener( "click", GlueTestSuite._loadTestFromButton, false );
    document.getElementById( "buttons" ).appendChild( b );
  },

  _loadTestFromButton: function() {
    // "this" will be the button
    GlueTestSuite._loadTest( this["script.file"] );
  },

  _loadTest: function( s_file ) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = GlueTestSuite._loadTestUpdate;
    xhr.open( "GET", chrome.runtime.getURL( s_file ), true );
    xhr.send();
  },
  
	_loadTestUpdate: function() {
    // "this" will be the request
    if( this.readyState == 4 ) {    // OK
      if( this.status == 200 ) {
        document.getElementById( "in" ).value = this.responseText;
      } else {
        document.getElementById( "in" ).value = "** unable to load script **";
      }
    }
	},
	
	
	// This provides the ability to test exec, it simply reverses whatever is
	//  given as it's parameters and writes it to "exec.txt"
  glueExec: function( o_glue, s_args, s_done_label, s_error_label ) {
    var i, n = "", c = s_args.length;
    while( --c >= 0 ) {
      n += s_args.charAt( c );
    }
    GlueFileManager.writeText( "exec.txt", n );
    return true;    // GluePlatform will redirect to ondonegoto itself
  }
};

if( GlueTestSuite.init() ) {
  window.addEventListener( "load", GlueTestSuite.start );
}