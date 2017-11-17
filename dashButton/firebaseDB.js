const {DB_CONFIG} = require('./constants');
var firebase = require('firebase');
var _ = require('underscore');

firebase.initializeApp(DB_CONFIG);
const database = firebase.database();
module.exports = class FirebaseDB {
    constructor() {};

    press(type, date) {
        console.log("Press()", type);
    	var press = {
            "date": date,
            "type": type
        };
    	const collection = database.ref("presses");
    	console.log("----Collection----", collection);
        console.log("press: ", press);
        collection.push(press);
    	console.log("After press");
    };
}
