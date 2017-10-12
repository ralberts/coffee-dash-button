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
            var messages = { "messages": HIPCHAT_TEXT_MESSAGE.map(msg => ({ "text": msg, "count": 0 })) };
            fs.writeFileSync("messages.json", JSON.stringify(messages));
        }
    }

    loadMessages() {
        for (var index in this.parsedData) {
            this.messages.push(this.parsedData[index].text);
        }
    }

    getAverage() {
        var count = 0;
        for (var index in this.parsedData) {
            count += this.parsedData[index].count;
        }
        return count / 18;
    }

    chooseRandomMessage() {
        var weightedArray = this.determineWeights();
        var msgIndex = Math.floor(Math.random() * weightedArray.length);
        console.log("Randomly chosen index: ", weightedArray[msgIndex]);
        console.log("Weight assigned to choice: ", Math.floor((1 - (this.parsedData[weightedArray[msgIndex]].count / this.getTotal())) * 10))
        while (this.parsedData[msgIndex].count > this.average) {
            console.log("This message is boring, skip!");
            msgIndex = Math.floor(Math.random() * this.messages.length);
        }
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
        for (var index in parsedData) {
            for (var x = 0; x < Math.floor((1 - (parsedData[index].count / getTotal())) * 10); x++ ) {
                weightedArray.push(index);
            }
        }
        return weightedArray;
    }
}
