
var WgetExe = {
  glueExec: function( o_glue, s_args, s_done_label, s_error_label ) {
    var data = {
      "glue": o_glue,
      "done": s_done_label,
      "error": s_error_label
    };
    var url, target;
    
    var i = s_args.indexOf( "-o" );
    if( i > -1 ) {
      url = s_args.substr( 0, i ).trim();
      data["target"] = s_args.substr( (i + 2) ).trim();
    } else {
      url = s_args;
      data["target"] = '';
    }

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = WgetExe._responseCallback;
    xhr.open( "GET", url, true );
    xhr["x-data"] = data;
    xhr.send();
    return true;
  },
  
  _responseCallback: function() {
    // "this" points to the xmlhttprequest object calling this
    if( this.readyState == 4 ) {    // done
      var data = this["x-data"], label;
      if( this.status == 200 ) {
        label = data["done"];
      } else {
        label = data["error"];
      }
      if( data["target"] ) {
        GlueFileManager.writeText( data["target"], this.responseText );
      }
      Glue.run( data["glue"], label );
    }
  }
};
  
GluePlatform.setExecApp( "wget", WgetExe );
