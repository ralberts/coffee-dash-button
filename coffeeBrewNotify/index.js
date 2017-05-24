
var request = require('request');
const {REST_URL, PULL_INTERVAL} = require('./constants');
var CoffeePot = require('./coffee');
var HipChat = require('./hipchat');
var hipChat = new HipChat();
var coffee;


function execute() {
	if(!coffee) {
		coffee = new CoffeePot();
		coffee.registerCallback(function() {
			const msg = "Coffee finished brewing. Please drink responsibly.";
			hipChat.notifyUsers(msg);
			hipChat.notifyRoom(msg);
		});
	}

	if(coffee.alreadyBrewing()) {
		console.log("Already brewing some coffee");
		return;
	}

	request(REST_URL, function (error, response, body) {
		if(body === "") {
			console.log("No coffee brewing.");
			return;
		}

		var json = JSON.parse(body);
		
		if(json.action === 'brewing') {
			coffee.brew(json.time);
			request.delete(REST_URL);
		}
	});
};


function run() {
	execute();
	setInterval(execute, PULL_INTERVAL * 1000);
};

run();
