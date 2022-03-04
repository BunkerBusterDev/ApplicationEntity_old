import config from 'config';

let protocolForNotification = null;

let HTTP_SUBSCRIPTION_ENABLE = 0;
let MQTT_SUBSCRIPTION_ENABLE = 0;

for(let i=0; i<config.subscriptionArray.length; i++) {
    const urlSubscription = new URL(config.subscriptionArray[i].nu);
    if(config.subscriptionArray[i].name !== undefined) {
        if(urlSubscription.protocol === 'http:') {
            HTTP_SUBSCRIPTION_ENABLE = 1;
            if(urlSubscription.hostname === 'autoset') {
                config.subscriptionArray[i]['nu'] = 'http://' + ip.address() + ':' + config.applicationEntity.port + urlSubscription.pathname;
            }
        }
        else if(urlSubscription.protocol === 'mqtt:') {
            MQTT_SUBSCRIPTION_ENABLE = 1;
        }
        else {
            console.log('notification uri of subscription is not supported');
            process.exit();
        }
    }
}

exports.start = () => {
    return new Promise((resolve, reject) => {
        if(HTTP_SUBSCRIPTION_ENABLE == 1) {
            protocolForNotification = require('./httpForNotification');
            protocolForNotification.start().then(state => {
                resolve(state);
            });
        }

        if(MQTT_SUBSCRIPTION_ENABLE == 1) {
            protocolForNotification = require('./mqttForNotification');
            protocolForNotification.start().then(state => {
                resolve(state);
            });
        }
    });
}