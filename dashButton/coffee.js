var moment = require("moment");
const {BREW_TIME} = require('./constants');

module.exports = class CoffeePot {
    constructor() {
        this.brewing = false;
        this.callbacks = [];
    }

    alreadyBrewing() {
        return this.brewing;
    }

    registerCallback(callback) {
        this.callbacks.push(callback);
    }

    brew(brewTime) {
        this.brewing = true;
        var now = moment();
        var brewStarted = moment(brewTime);
        var diff = now.diff(brewStarted, 'seconds');
        console.log("Difference between now and when brew was actually started (seconds):", diff);
        var startTimerInSeconds = (BREW_TIME * 60) - diff;

        if(startTimerInSeconds < 0) {
            console.log("Timer is less than brew time and thus is negative.");
            console.log("Not setting timer.");
            return;
        }
        console.log("Brewing time left (minutes):", startTimerInSeconds / 60 + "m " + startTimerInSeconds % 60 + "s");
        this.startTimer(startTimerInSeconds);
    }

    startTimer(timer) {
        setTimeout(() => {
            console.log("Brew finished");
            this.brewing = false;
            this.brewDone();
        }, timer * 1000);
    }

    brewDone() {
        for(var cb of this.callbacks) {
            cb();
        }
    }
}