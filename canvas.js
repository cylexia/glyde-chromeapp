var CanvasTest = {
  canvas: null,
  
  init: function( c ) {
    CanvasTest.canvas = c;
  },
  
  update: function() {
    var ctx = CanvasTest.canvas.getContext( "2d" );
    ctx.font = "30px Arial";
    ctx.strokeText( "Hello, World!", 10, 50 );
  }
};