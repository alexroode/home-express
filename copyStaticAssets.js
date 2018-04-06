var shell = require('shelljs');

shell.cp('src/music/music.json', 'dist/music/');
shell.cp('-R', 'src/public/audio', 'dist/public/');
shell.cp('-R', 'src/public/scores', 'dist/public/');
shell.cp('-R', 'src/public/img', 'dist/public/');