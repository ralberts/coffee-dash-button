import DashButton from 'dash-button';
const http = require('http');
const request = require('request');
const {BUTTONS, REST_API, REST_API_URL, HIPCHAT_TEXT_MESSAGE} = require('./constants');
const HOURS_OFFSET = 17;

import CoffeePot from './coffee';
import HipChat from './hipchat';
import FirebaseDB from './firebaseDB';
import _ from 'underscore';
import HealthStatus from './healthstatus';

var coffee = new CoffeePot();
var hipChat = new HipChat();
var firebaseDB = new FirebaseDB();
var health = new HealthStatus();

BUTTONS.forEach((buttonConfig) => {
	execute(new DashButton(buttonConfig.mac, { networkInterface: buttonConfig.networkInterface }), buttonConfig);
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
			let date = new Date();
			date.setHours(date.getHours() + HOURS_OFFSET);
			coffee.brew(date.toISOString());
			console.log("Post brew");
			firebaseDB.press(config.coffeeType, date);
			console.log("Post db");
		});
	}
}

//health.run();
console.log("All ready!");
