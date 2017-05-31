import DashButton from 'dash-button';
var http = require('http');
var request = require('request');
const BUTTONS = require('./constants').BUTTONS;
const DASH_BUTTON_MAC_ADDRESS = BUTTONS[0].mac;

let button = new DashButton(DASH_BUTTON_MAC_ADDRESS);

let subscription = button.addListener(async () => {
	console.log("Button pressed!");
	request({
		url: 'http://ryanalberts.com/coffee/index.php',
		method: 'POST',
		json: true,
		body: {
			action: 'brewing',
			time: new Date().toISOString()
		}
	}, function (error, response, body) {
		console.log(response, body, error);
	});
	
});

console.log("All ready!");




