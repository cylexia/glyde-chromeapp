window.addEventListener( "load", gtest );

function gtest() {
  document.getElementById( "test" ).addEventListener( "click", runscript );
}

function runscript() {
  var script = document.getElementById( "in" ).value;
  var g = {};
  Glue.init( g );
  Glue.load( g, script );
  Glue.run( g );
  
}