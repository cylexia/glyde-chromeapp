window.addEventListener( "load", gtest );

function gtest() {
  document.getElementById( "test" ).addEventListener( "click", runscript );
}

function runscript() {
  var script = document.getElementById( "in" ).value;
  var g = {};
  Glue.init( g );
  Glue.setStdOut( goutput );
  Glue.load( g, script );
  Glue.run( g );
  
}

function goutput( s_str ) {
  document.getElementById( "out" ).value += s_str;
}