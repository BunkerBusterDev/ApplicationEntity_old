import shortid from 'shortid';

import config from 'config';
import MqttClient from './mqttClient';

let requestCount = 0;

const deleteSubscription = (parent, rn, callback) => {
    const requestIdentifier = shortid.generate();

    let requestMessage = {};
    requestMessage['m2m:rqp'] = {};
    requestMessage['m2m:rqp'].op = '4'; // delete
    requestMessage['m2m:rqp'].to = parent + '/' + rn;
    requestMessage['m2m:rqp'].fr = config.applicationEntity.id;
    requestMessage['m2m:rqp'].rqi = requestIdentifier;
    requestMessage['m2m:rqp'].pc = {};

    MqttClient.publish('requestTopic', JSON.stringify(requestMessage['m2m:rqp']), requestIdentifier, callback);
}

exports.deleteSubscriptionAll = () => {
    return new Promise((resolve, reject) => {
        if(config.subscriptionArray.length === 0) {
            resolve({state: 'start-tcpServer'});
        }
        else {
            const parent = config.subscriptionArray[requestCount].parent;
            const rn = config.subscriptionArray[requestCount].name;

            deleteSubscription(parent, rn, (responseStatusCode, responseBody) => {
                if(responseStatusCode === 2000 || responseStatusCode === 2002 || responseStatusCode === 4004 || responseStatusCode === 4105 || responseStatusCode === 5106) {
                    console.log(`${requestCount} - ${rn} - x-m2m-rsc : ${responseStatusCode} <----`);
                    console.log(responseBody);

                    requestCount++;

                    if(config.subscriptionArray.length <= requestCount) {
                        requestCount = 0;
                        resolve({state: 'create-subscription'});
                    }
                }
            });
        }
    });
}

const createSubscription = (parent, rn, nu, callback) => {
    const requestIdentifier = shortid.generate();

    let requestMessage = {};
    requestMessage['m2m:rqp'] = {};
    requestMessage['m2m:rqp'].op = '1'; // create
    requestMessage['m2m:rqp'].to = parent;
    requestMessage['m2m:rqp'].fr = config.applicationEntity.id;
    requestMessage['m2m:rqp'].rqi = requestIdentifier;
    requestMessage['m2m:rqp'].ty = '23'; // sub
    requestMessage['m2m:rqp'].pc = {};
    requestMessage['m2m:rqp'].pc['m2m:sub'] = {};
    requestMessage['m2m:rqp'].pc['m2m:sub'].rn = rn;
    requestMessage['m2m:rqp'].pc['m2m:sub'].enc = {};
    requestMessage['m2m:rqp'].pc['m2m:sub'].enc.net = [];
    requestMessage['m2m:rqp'].pc['m2m:sub'].enc.net.push('3');
    requestMessage['m2m:rqp'].pc['m2m:sub'].nu = [];
    requestMessage['m2m:rqp'].pc['m2m:sub'].nu.push(nu);
    requestMessage['m2m:rqp'].pc['m2m:sub'].nct = '2';

    MqttClient.publish('requestTopic', JSON.stringify(requestMessage['m2m:rqp']), requestIdentifier, callback);
}

exports.createSubscriptionAll = () => {
    return new Promise((resolve, reject) => {
        if(config.subscriptionArray.length === 0) {
            resolve({state: 'start-tcpServer'});
        }
        else {
            const parent = config.subscriptionArray[requestCount].parent;
            const rn = config.subscriptionArray[requestCount].name;
            const nu = config.subscriptionArray[requestCount].nu;

            createSubscription(parent, rn, nu, (responseStatusCode, responseBody) => {
                if(responseStatusCode === 2001 || responseStatusCode === 4105 || responseStatusCode === 5106) {
                    console.log(`${requestCount} - ${rn} - x-m2m-rsc : ${responseStatusCode} <----`);
                    console.log(responseBody);

                    requestCount++;

                    if(config.subscriptionArray.length <= requestCount) {
                        requestCount = 0;
                        resolve({state: 'start-tcpServer'});
                    }
                }
            });
        }
    });
}