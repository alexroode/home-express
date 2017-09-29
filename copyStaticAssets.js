var shell = require('shelljs');

shell.cp('-R', 'src/public/audio', 'dist/public/');
shell.cp('-R', 'src/public/scores', 'dist/public/');