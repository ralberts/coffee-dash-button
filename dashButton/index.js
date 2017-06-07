import DashButton from 'dash-button';
const http = require('http');
const request = require('request');
const {BUTTONS, REST_API, REST_API_URL, HIPCHAT_TEXT_MESSAGE} = require('./constants');

import CoffeePot from './coffee';
import HipChat from './hipchat';
import _ from 'underscore';
import HealthStatus from './healthstatus';

var hipChat = new HipChat();
var coffee = new CoffeePot();
var health = new HealthStatus();

BUTTONS.forEach((buttonConfig) => {
	execute(new DashButton(buttonConfig.mac), buttonConfig);
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
			console.log("Button pressed! Coffee type:", config.coffeeType);

			if(coffee.alreadyBrewing()) {
				console.log("Already brewing some coffee");
				return;
			}

			coffee.registerCallback(function() {
				const msg = config.coffeeType + " coffee finished brewing. " + _.sample(HIPCHAT_TEXT_MESSAGE);
				hipChat.notifyRoom(msg);
			});

			coffee.brew(new Date().toISOString());
		});
	}
}

health.run();
console.log("All ready!");
