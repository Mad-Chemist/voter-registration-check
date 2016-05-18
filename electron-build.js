"use strict"

const appJson = require('./app/package.json');
const builder = require("electron-builder");
const options = {
	"verison":appJson.version,
	"platform": [builder.Platform.OSX, builder.Platform.WINDOWS],
	"asar":true,
	"iconUrl":"./build/Icon.ico",
	"productName": appJson.name,
	"app-bundle-id": "css.expert.prch",
	"app-category-type": "public.app-category.utilities",
	"out":"./dist"

};

// Promise is returned
var build = builder.build(options)
	.then(() => {
		console.log('------------');
		console.log('Built ' + appJson.name + ' V' + appJson.version);
		console.log('------------');

	})
	.catch((error) => {
		console.log('------------');
		console.error(error);
		console.log('------------')
	});