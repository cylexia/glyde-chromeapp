
var GlueTestSuite = {
  _inited: false,
  
  init: function() {
    if( !GlueTestSuite._inited ) {
      GlueTestSuite._inited = true;
    }
    return true;
  },
  
  start: function() {
    document.getElementById( "run" ).addEventListener( "click", GlueTestSuite.runScript, false );
    GlueTestSuite._addTestLoadButton( "Core", "/glue-tests/core.test" );
  },

  runScript: function() {
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
	}
};

if( GlueTestSuite.init() ) {
  window.addEventListener( "load", GlueTestSuite.start );
}