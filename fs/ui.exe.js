/**
 * Emulate ui.exe to provide user interaction via
 *  ask       - get a value
 *  choose    - choose a value from a list
 * 
 */
 
var UiExe = {
  glueExec: function( o_glue, s_args, s_done_label, s_error_label ) {
    
    Glue.run( o_glue, s_done_label );
    return true;
  }
};
    
    
GluePlatform.setExecApp( "ui", UiExe );
