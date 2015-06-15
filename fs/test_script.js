GlueFileManager.setResource( "test.script", [
    'f.loadResource "test/main.map" as "main"',
    'YB = decrease Y by 20',
    'f.drawAs "icon" id "main.icon" atX X atY YB',
    'f.writeAs "text" atX X atY Y value TEXT colour "#f00" size 4 thickness 2',
    'f.removeResource "main"',
	  'stop'
  ].join( "\n" )
);

