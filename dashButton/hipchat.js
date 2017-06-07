var request = require('request');
const {HIPCHAT_URL, EMAIL_SUFFIX, HIPCHAT_ROOM, HIPCHAT_ROOM_URL, HIPCHAT_AUTH_TOKEN, HIPCHAT_INDIVIDUAL_USERS} = require('./constants');

module.exports = class HipChat {
    constructor() {
    }

    notifyUsers(message) {
        console.log('Notifying users coffee is done.');
        for(var user of HIPCHAT_INDIVIDUAL_USERS) {
            request({
                url: HIPCHAT_URL,
                method: 'POST',
                json: true,
                body: {
                    'to': user + EMAIL_SUFFIX,
                    'msg': message
                }
            }, function (error, response, body) {
                console.log('Response from hipchat post:', response && response.statusCode);
            });
        }
    }
    
    notifyRoom(message, notify = true, from = "Coffee Button") {
        console.log('Notifying coffee room.');
        request({
            url: HIPCHAT_ROOM_URL + '/v2/room/' + HIPCHAT_ROOM + '/notification',
            method: 'POST',
            auth: {
                'bearer': HIPCHAT_AUTH_TOKEN
            },
            json: true,
            body: {
                'from': from,
                'message': message,
                'notify': notify
            }
        }, function (error, response, body) {
            console.log('Response from hipchat post:', response && response.statusCode);
        });
    }
}