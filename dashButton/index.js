import DashButton from 'dash-button';
const http = require('http');
const request = require('request');
const {BUTTONS, REST_API, REST_API_URL} = require('./constants');

var CoffeePot = require('../coffeeBrewNotify/coffee');
var HipChat = require('../coffeeBrewNotify/hipchat');
var hipChat = new HipChat();
var coffee = new CoffeePot();

const DASH_BUTTON_MAC_ADDRESS_1 = BUTTONS[0].mac;

BUTTONS.forEach((buttonConfig) => {
	let button = new DashButton(buttonConfig.mac);
	execute(button, buttonConfig);
});

function execute(button, config) {
	if(REST_API) {
		let subscription = button.addListener(async () => {
			console.log("Button pressed!");
			request({
				url: REST_API_URL,
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
	} else {
		let subscription = button.addListener(async () => {
			console.log("Button pressed! Coffee type: ", config.coffeeType);

			if(coffee.alreadyBrewing()) {
				console.log("Already brewing some coffee");
				return;
			}

			coffee.registerCallback(function() {
				const msg = config.coffeeType + " coffee finished brewing. Please drink responsibly.";
				//hipChat.notifyRoom(msg);
			});
		
			coffee.brew(new Date().toISOString());
		});
	}
}
console.log("All ready!");




