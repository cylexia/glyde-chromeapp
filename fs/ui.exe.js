/**
 * Emulate ui.exe to provide user interaction via
 *  ask       - get a value
 *  choose    - choose a value from a list
 * 
 */
 
var UiExe = {
  _glue_instance: null,
  
  glueExec: function( o_glue, s_args, s_done_label, s_error_label ) {
    UiExe._glue_instance = o_glue;
    var args = UiExe._parseCommandLine( s_args );
    
    UiExe._ask( args, s_done_label, s_error_label );
    
    //Glue.run( o_glue, s_done_label );
    return true;
  },
  
  _ask: function( d_data, s_done_label, s_error_label ) {
    var t = _.c( 'input', { "width": "95%" }, { "type": "text", "size": "40" } );
    var frame = UiExe._createDialogFrame( 
        Dict.valueOf( d_data, "prompt" ), 
        t,
        UiExe._handleAskOK,
        UiExe._handleAskCancel
      );
    frame["uiexe.field"] = t;
    frame["uiexe.label.done"] = s_done_label;
    frame["uiexe.label.error"] = s_error_label;
    document.getElementsByTagName( "body" )[0].appendChild( frame );
    t.focus();
  },
  
  _createDialogFrame: function( s_text, o_innerdiv, f_on_ok, f_on_cancel ) {
    var text = _.c( 'div', { "padding": "5px" } );
    _.at( text, s_text );
    var wrap = _.c( 'div', { 
        "overflow": "auto", 
        "text-align": "center"
      } );
    wrap.appendChild( o_innerdiv );
    var btns = _.c( 'div', { "padding": "5px" } );
    var ok = _.c( 'button', { "margin": "2px" } );
    _.at( ok, "OK" );
    ok.addEventListener( "click", f_on_ok );
    btns.appendChild( ok );
    var cancel = _.c( 'button', { "margin": "2px" } );
    _.at( cancel, "Cancel" );
    cancel.addEventListener( "click", f_on_cancel );
    btns.appendChild( cancel );
    var back = _.c( 'div', { 
        "border": "2px solid #555",
        "margin": "1px",
        "background": "#fff",
        "padding": "10px",
        "position": "absolute",
        "width": "600px",
        //"height": "200px"
      } );
    back.appendChild( text );
    back.appendChild( wrap );
    back.appendChild( btns );
    // TODO: buttons
    var frame = _.c( 'div', {
        "position": "absolute",
        "top": "0px", "left": "0px", "width": "100%", "height": "100%",
        "text-align": "center",
        "z-index": "1000",
      } );
    var dimmer = _.c( 'div', {
        "position": "absolute",
        "top": "0px", "left": "0px", "width": "100%", "height": "100%",
        "background": "#444", "opacity": "0.5"
    } );
    frame.appendChild( dimmer );
    // clientWidth is inside width taking into account borders etc.
    // offsetWidth is the total width
    var body = document.getElementsByTagName("body")[0];
    _.s( back, { "left": ((body.clientWidth - 600) / 2), "top": "0px" } );
    frame.appendChild( back );
    ok["uiexe.frame"] = frame;
    cancel["uiexe.frame"] = frame;
    return frame;
  },
  
  _handleAskOK: function() {
      var frame = this["uiexe.frame"];
      var text = frame["uiexe.field"].value;
      var label = frame["uiexe.label.done"];
      frame.parentNode.removeChild( frame );
      console.log( text );
      Glue.run( UiExe._glue_instance, label );
  },
  
  _handleAskCancel: function() {
      var frame = this["uiexe.frame"];
      var label = frame["uiexe.label.done"];
      frame.parentNode.removeChild( frame );
      console.log( "cancelled: ''" );
      Glue.run( UiExe._glue_instance, label );
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
                k = word.substr( 1 ).toLowerCase();
              } else {
                Dict.set( d, k, word );
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
