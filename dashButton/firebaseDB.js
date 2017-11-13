
var firebase = require('firebase');
var _ = require('underscore');
const config = {
    apiKey: 'AIzaSyDMNa01ILPSggoTa8CURd_Bt52eDaKN_Fc',
    authDomain: 'coffee-dash-button.firebaseapp.com',
    databaseURL: 'https://coffee-dash-button.firebaseio.com/'
}

modules.exports = class FirebaseDB {
    constructor() {
        firebase.initializeApp(config);
    };

    press(type, date) {
        const database = firebase.database();
        var press = {
            date: date,
            type: type
        };
        console.log("press: ", press);
        collection.push(press);
    };

}
