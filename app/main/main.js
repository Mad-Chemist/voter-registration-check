/*
 * Display interface to user and allow them to check voter registration status
 */

const electron = require('electron');
const app = electron.app; // Module to control application life.
const BrowserWindow = electron.BrowserWindow; // Module to create native browser window.
const seleniumRunner = require('./run-selenium.js');
var window = null; // Keep a global reference of the window object, if you don't, the window will be closed automatically when the JavaScript object is garbage collected.

app.on('window-all-closed', function() { // Quit when all windows are closed.
	// On OS X it is common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q
	if (process.platform != 'darwin') {
		app.quit();
	}
});

// TODO: Look into handling close event and enabling a way for user to close window
app.on('ready', function() {
	window = new BrowserWindow({ frame: false, resizable: false, width: 800, height: 600 }); // Create the browser window.
	window.loadURL('file://' + __dirname + '/../render/index.html'); // and load the index.html of the app.
	// window.webContents.openDevTools(); // Open the DevTools.

	electron.ipcMain.on('close-window', window.close)
		.on('save-voter', function(event, voterInfo) {
			function callback(ch, ms) {
				event.sender.send(ch, ms);
			}
			seleniumRunner.init(voterInfo, callback);
		});

	window.on('closed', function() {
		window = null;
	});
});