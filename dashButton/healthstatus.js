var request = require('request');
var fs = require('fs');
const {REST_API_HEALTH_URL, PULL_INTERVAL} = require('./constants');
import HipChat from './hipchat';

module.exports = class HealthStatus {
    constructor() {
        this.interval;
        this.hipChat = new HipChat();
    }

    execute() {
       	request(REST_API_HEALTH_URL, (error, response, body) => {
            if(error) {
                console.log("Error check on health request:", error);
                return;
            }

            if(body === "") { return; }

	    try {

            	var json = JSON.parse(body);
            
            	if(json.action === 'test') {
                	console.log("Request for health status.");
	                request.delete(REST_API_HEALTH_URL);
        	        this.hipChat.notifyRoom("We're still running and waiting for someone to brew some coffee!", false, "Coffee Health Status");

                	// var file = fs.readFileSync("./output.txt", "utf8");
			// file = file.replace(/(?:\r\n|\r|\n)/g, '<br/>');
	             	// this.hipChat.notifyRoom("Current log: " + file, false, "Coffee Health Status");
        	}

	    } catch (e) {
		console.log("Error parsing health request.", e);
	    }

        });
    }

    run() {
        if(this.interval) {
            console.log("Already running health interval check");
            return;
        }

	    this.execute();
	    this.interval = setInterval(() => { this.execute() }, PULL_INTERVAL * 1000);
    }

    stop() {
        clearInterval(this.interval);
    }

}
