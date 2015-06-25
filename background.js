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
console.log( "starting" );
    // there is no launcher, the runtime window will load it's resources
    //  we just give it the ".glyde" web-definition url
    //Glyde.startApp( chrome.runtime.getURL( "fs/com.cylexia.g.lightswitch.glyde" ) );
    Glyde.startApp( "http://localhost/glydecontent/srh_dno.glyde" );
  }
};

// Attach the startup
if( CylexiaApp.init() ) {
  chrome.app.runtime.onLaunched.addListener( CylexiaApp.start );
}

