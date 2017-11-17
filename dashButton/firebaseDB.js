//'use strict';

var firebase = require('firebase');
var _ = require('underscore');
const config = {
    apiKey: 'AIzaSyDMNa01ILPSggoTa8CURd_Bt52eDaKN_Fc',
    authDomain: 'coffee-dash-button.firebaseapp.com',
    databaseURL: 'https://coffee-dash-button.firebaseio.com/'
}
firebase.initializeApp(config);
const database = firebase.database();
module.exports = class FirebaseDB {
    constructor() {
	//console.log("FirebaseDB constructor"); 
        //firebase.initializeApp(config);
	//console.log("firebase", firebase);
    };

    press(type, date) {
        console.log("Press()", type);
	//console.log("Config", confg);
	//firebase.initializeApp(config);
	//console.log("firebase", firebase);
	//const database = firebase.database();
        //console.log(database);
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
