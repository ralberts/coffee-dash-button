'use strict';

var fs = require('fs');
var firebase = require('firebase');
var _ = require('underscore');
var args = process.argv.slice(2);
var methods = [
  'press', 'sample', 'getTotalPots', 'getPercentageByType', 'lastTimeBrewedByType', 'lastTypeBrewed'
];

var config = {
  apiKey: 'AIzaSyDMNa01ILPSggoTa8CURd_Bt52eDaKN_Fc',
  authDomain: 'coffee-dash-button.firebaseapp.com',
  databaseURL: 'https://coffee-dash-button.firebaseio.com/'
}
firebase.initializeApp(config);
var database = firebase.database();

args.forEach(function(val, index) {
  if (_.contains(methods, val)) {
    if (args[index + 1] && Number.isInteger(parseInt(args[index + 1]))) {
      for (var i = 0; i < parseInt(args[index + 1]); i++) {
        eval(val + '()');
      }
    } else if (args[index + 1]) {
      eval(val + '("' + args[index + 1] + '")');
    } else {
      eval(val + '()');
    }
  }
});

function press() {
  var collection = database.ref('presses');
  var types = [
    "Morning Roast",
    "Morning Roast",
    "French Roast"
  ];

  var press = {
    date: new Date().toISOString(),
    type: _.sample(types)
  };
  console.log("press: ", press);
  collection.push(press);
  // firebase.database().goOffline();
}

function printAll(ref) {
  ref.once('value')
  .then(function (snap) {
    console.log('snap.val()', snap.val());
    firebase.database().goOffline();
  });
}

function sample() {
  var collection = database.ref('messages');
  collection.once('value')
    .then(function (snap) {
      var messages = snap.val();
      console.log(_.sample(_.map(messages, 'text')));
      firebase.database().goOffline();
    });
}

function getTotalPots() {
  var collection = database.ref('presses');
  collection.once('value')
    .then(function (snap) {
      var presses = snap.val();
      console.log(_.map(presses, 'type').length + ' pots have been brewed.');
      return _.map(presses, 'type').length;
      firebase.database().goOffline();
    });
}

function getPercentageByType() {
  var collection = database.ref('presses');
  var french = 0;
  var medium = 0;
  collection.once('value')
    .then(function (snap) {
      var presses = snap.val();
      var types = _.map(presses, 'type');
      types.forEach(function(value) {
        if (value === 'French Roast') {
          french++;
        } else if (value === 'Morning Roast') {
          medium++;
        }
      });
      console.log("french: ", french, (french / types.length * 100).toFixed(2) + '%');
      console.log("medium: ", medium, (medium / types.length * 100).toFixed(2) + '%');
      firebase.database().goOffline();
    });
}

function lastTimeBrewedByType(type) {
  var collection = database.ref('presses');
  var one_day = 1000*60*60*24;
  var one_hour = 1000*60*60;
  var one_minute = 1000*60;
  var one_second = 1000;

  collection.once('value')
    .then(function (snap) {
      var presses = _.map(snap.val());
      presses = _.filter(presses, function(item) {
        return item.type.toLowerCase().includes(type.toLowerCase());
      });
      var queriedType = _.sortBy(presses, "date").reverse()[0].type;
      var difference = Date.parse(new Date().toISOString()) - Date.parse(_.sortBy(presses, "date").reverse()[0].date);

      var days = Math.floor(difference/one_day);
      var hours = Math.floor(difference/one_hour);
      var minutes = Math.floor(difference/one_minute);
      var seconds = Math.floor(difference/one_second);
      var returnString = "It's been ";
      if (days > 0) {
        // console.log(days);
        returnString += (days + ' day(s), ');
      }
      if (hours > 0) {
        // console.log(hours);
        returnString += (hours - days * 24 + ' hour(s), ');
      }
      if (minutes > 0) {
        // console.log(minutes);
        returnString += (minutes - hours * 60 + ' minute(s), ');
      }
      if (seconds > 0){
        // console.log(seconds);
        returnString += (seconds - minutes * 60 + ' second(s)');
      }
      returnString += " since a pot of " + queriedType + " was brewed."
      console.log(returnString);
      firebase.database().goOffline();
    });
}

function lastTypeBrewed() {
  var collection = database.ref('presses');
  collection.once('value')
    .then(function (snap) {
      var presses = _.map(snap.val());
      var type = _.sortBy(presses, "date").reverse()[0].type;
      console.log(type);
      var date = _.sortBy(presses, "date").reverse()[0].date;
      console.log(new Date(date).toDateString());
      firebase.database().goOffline();
    });
}
