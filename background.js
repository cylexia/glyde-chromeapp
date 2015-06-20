/**
 * App startup, loads the config then determines what to do
 *
 * There is code below the definition to start
 */

var CylexiaApp = {
  _inited: false,
  
  init: function() {
    if( !CylexiaApp._inited ) {
      CylexiaApp._inited = true;
      return true;
    }
    return false;
  },
  
  start: function( o_launch_data ) {
    // Load the config file and restart via the callback
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = CylexiaApp.startFromXHR;
    xhr.open( "GET", chrome.runtime.getURL( "config.dat" ), true );
    xhr.send();
  },
  
  startFromXHR: function() {
    // "this" will be the request
    if( this.responseText ) {
      var config = Utils.loadSimpleConfig( this.responseText );
      var run = Dict.valueOf( config, "run" );
      if( run ) {
        CylexiaApp._startApp( run );
      } else {
        CylexiaApp._startLauncher();
      }
    }
  },
  
  _startApp: function( s_name ) {
    // load app files here instead of all at once? (need to figure something as no launcher)
    chrome.app.window.create(
      ('glydert.html#' + s_name + ".app"),
      {
        id: s_name,
        bounds: {width: 800, height: 600},
        resizable: false,
        frame: {
          //type: "none"
        }
      } 
    );
  },
  
  _startLauncher: function() {
    chrome.app.window.create(
      'glydelauncher.html',
      {
        id: 'launcherWindow',
        bounds: {width: 600, height: 600},
        resizable: true
      } 
    );
  }
};

// Attach the startup
if( CylexiaApp.init() ) {
  chrome.app.runtime.onLaunched.addListener( CylexiaApp.start );
}

