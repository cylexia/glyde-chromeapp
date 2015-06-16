/**
 * Emulate ui.exe to provide user interaction via
 *  ask       - get a value
 *  choose    - choose a value from a list
 * 
 */
 
var UiExe = {
  glueExec: function( o_glue, s_args, s_done_label, s_error_label ) {
    var args = UiExe._parseCommandLine( s_args );
    
    Glue.run( o_glue, s_done_label );
    return true;
  },
  
  _parseCommandLine: function( s_cmdline, d_defaults ) {
        var d;
        if( d_defaults ) {
            d = d_defaults;
        } else {
            d = Dict.create();
        }
        var cmd, k = "_", v = "", in_q = false, word = "", c;
        for( var i = 0, l = s_cmdline.length; i <= l; i++ ) {
          if( i < l ) {
            c = s_cmdline.charAt( i );
          } else {
            c = " ";
          }
          if( in_q ) {
            if( c == '"' ) {
              in_q = false;
            } else {
              word += c;
            }
          } else {
            if( c == " " ) {
              if( (word.length > 0) && (word.charAt( 0 ) == "-") && (k === "") ) {
                k = word.substr( 1 ).toUpperCase();
              } else {
                d[k] = word;
                k = "";
              }
              word = "";
            } else if( c == "|" ) {
              word += s_cmdline.charAt( ++i );
            } else if( c == '"' ) {
              in_q = true;
            } else {
              word += c;
            }
          }
        }
        return d;
    }
    
};
    
    
GluePlatform.setExecApp( "ui", UiExe );
