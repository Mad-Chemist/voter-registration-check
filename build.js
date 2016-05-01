
'use strict';

var options = {
	'all':true,
	'overwrite':true,
	'name':'Voter-Registration-Check',
	'dir':'./app',
	'out':'./dist',
	'arch':'all',
	'platform':'all'
};

function done_callback (err, appPaths) {
	if (err) {
		console.error('Error from done_callback: ', err);
	}
}

try {
	require('electron-packager')(options, done_callback);
}
catch(error) {
	console.error(error);
}