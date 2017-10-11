import DashButton from 'dash-button';
const http = require('http');
const request = require('request');
const {BUTTONS, REST_API, REST_API_URL, HIPCHAT_TEXT_MESSAGE} = require('./constants');

import CoffeePot from './coffee';
import HipChat from './hipchat';
import _ from 'underscore';
import HealthStatus from './healthstatus';

var fs = require('fs');

var hipChat = new HipChat();
var coffee = new CoffeePot();
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
				// const msg = config.coffeeType + " coffee finished brewing. " + _.sample(HIPCHAT_TEXT_MESSAGE);
				const msg = config.coffeeType + " coffee finished brewing. " + grabWeightedRandomMessage();
				hipChat.notifyRoom(msg);
			});

			coffee.brew(new Date().toISOString());
		});
	}
}

function grabWeightedRandomMessage() {
	var source = "./messages.json";
	var rawData = fs.readFileSync(source);
	var parsedData = JSON.parse(rawData).messages;
	var messages = [];
	getMessages();
	var average = getAverage();
	chooseRandomMessage();
}

function getMessages() {
    for (var index in parsedData) {
        messages.push(parsedData[index].text);
    }
}

function getAverage() {
    var count = 0;
    for (var index in parsedData) {
        count += parsedData[index].count;
    }
    return count / 18;
}

function chooseRandomMessage() {
        var msgIndex = Math.floor(Math.random() * messages.length);
		while (parsedData[msgIndex].count > average) {
			console.log("This message is boring, skip!");
			msgIndex = Math.floor(Math.random() * messages.length);
		}
		updateMessageCount(msgIndex);
		return messages[msgIndex];
}

function updateMessageCount(index) {
    parsedData[index].count++;
    var updatedData = JSON.stringify({
        "messages": parsedData
    }, null, 4);
    fs.writeFileSync("messages.json", updatedData);
}

health.run();
console.log("All ready!");
