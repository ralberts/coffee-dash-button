var fs = require('fs');
const { HIPCHAT_TEXT_MESSAGE } = require('./constants');

module.exports = class Messages {
    constructor() {
        this.messages = [];
        this.parsedData;
        this.source = "./messages.json";
	this.average;
        this.init();
    }

    getRandomMessage() {
        try {
            var rawData = fs.readFileSync(this.source);
            this.parsedData = JSON.parse(rawData).messages;
            this.loadMessages();
            this.average = this.getAverage();
            return this.chooseRandomMessage();
        } catch (e) {
            console.log("ERROR! Problem retrieving random message.", e);
            return "";
        }
    }

    init() {
        if (!fs.existsSync(this.source)) {
            var messages = { "messages": HIPCHAT_TEXT_MESSAGE.map(msg => ({ "text": msg, "count": 1 })) };
            fs.writeFileSync("messages.json", JSON.stringify(messages));
        }
    }

    loadMessages() {
        for (var index in this.parsedData) {
            this.messages.push(this.parsedData[index].text);
        }
    }

    getAverage() {
        return this.getTotal() / 18;
    }

    getTotal() {
        var count = 0;
        for (var index in this.parsedData) {
            count += this.parsedData[index].count;
        }
        return count;
    }

    chooseRandomMessage() {
        var weightedArray = this.determineWeights();
        var msgIndex = Math.floor(Math.random() * weightedArray.length);
        this.updateMessageCount(weightedArray[msgIndex]);
        return this.messages[weightedArray[msgIndex]];
    }

    updateMessageCount(index) {
        this.parsedData[index].count++;
        var updatedData = JSON.stringify({
            "messages": this.parsedData
        }, null, 4);
        fs.writeFileSync("messages.json", updatedData);
    }

    determineWeights() {
        var weightedArray = [];
        for (var index in this.parsedData) {
	    if ( this.parsedData[index].count < this.getAverage()) {
		weightedArray.push(index);
	    }
            //for (var x = 1; x <= Math.floor((1 - (this.parsedData[index].count / this.getTotal())) * 100 - 90); x++){
            //    weightedArray.push(index);
            //}
        }
        return weightedArray;
    }
}
