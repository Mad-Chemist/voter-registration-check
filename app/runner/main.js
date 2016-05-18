/*
 * Display interface to user and allow them to check voter registration status
 */

"use strict";

var electron = require('electron');
var app = electron.app; // Module to control application life.
var BrowserWindow = electron.BrowserWindow; // Module to create native browser window.
var window = {}; // Keep a global reference of the window object, if you don't, the window will be closed automatically when the JavaScript object is garbage collected.

var closed = function() {
	window.close;
	app.quit();
};

electron.ipcMain
	.on('close-window', closed)
	.on('save-voter', function(event, voterInfo) {
		let seleniumRunner = require('../wd.js');
		function callback(channel, message) {
			event.sender.send(channel, message);
		}
		seleniumRunner.init(voterInfo, callback);
	});

app.on('ready', function() {
	app.on('window-all-closed', closed);

	(function() { // Create the browser window.
		window = new BrowserWindow({ 
			frame: false,
			resizable: true,
			width:800,
			height:450,
			center:true,
			title:"Voter Registration Check"
		});
		window.loadURL('file://' + __dirname + '/../render/index.html'); // and load the index.html of the app.
		window.webContents.openDevTools(); // Open the DevTools.

		window.on('closed', closed);
	}());
});