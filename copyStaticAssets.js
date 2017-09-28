var shell = require('shelljs');

shell.cp('-R', 'src/public/audio', 'dist/public/audio/');
shell.cp('-R', 'src/public/scores', 'dist/public/scores/');