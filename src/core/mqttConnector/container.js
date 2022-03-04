import shortid from 'shortid';

import config from 'config';
import MqttClient from './mqttClient';

let requestCount = 0;

const createContainer = (parent, rn, callback) => {
    const requestIdentifier = shortid.generate();

    let requestMessage = {};
    requestMessage['m2m:rqp'] = {};
    requestMessage['m2m:rqp'].op = '1'; // create
    requestMessage['m2m:rqp'].to = parent;
    requestMessage['m2m:rqp'].fr = config.applicationEntity.id;
    requestMessage['m2m:rqp'].rqi = requestIdentifier;
    requestMessage['m2m:rqp'].ty = '3'; // container
    requestMessage['m2m:rqp'].pc = {};
    requestMessage['m2m:rqp'].pc['m2m:cnt'] = {};
    requestMessage['m2m:rqp'].pc['m2m:cnt'].rn = rn;
    requestMessage['m2m:rqp'].pc['m2m:cnt'].lbl = [];
    requestMessage['m2m:rqp'].pc['m2m:cnt'].lbl.push(rn);

    MqttClient.publish('requestTopic', JSON.stringify(requestMessage['m2m:rqp']), requestIdentifier, callback);
}

exports.createContainerAll = () => {
    return new Promise((resolve, reject) => {
        if(config.containerArray.length === 0) {
            resolve({state: 'delete-subscription'});
        }
        else {
            const parent = config.containerArray[requestCount].parent;
            const rn = config.containerArray[requestCount].name;
            createContainer(parent, rn, (responseStatusCode, responseBody) => {
                if(responseStatusCode === 2001 || responseStatusCode === 5106 || responseStatusCode === 4105) {
                    console.log(`${requestCount} - ${rn} - x-m2m-rsc : ${responseStatusCode} <----`);
                    console.log(responseBody);

                    requestCount++;

                    if(config.containerArray.length <= requestCount) {
                        requestCount = 0;
                        resolve({state: 'delete-subscription'});
                    }
                }
            });
        }
    });
}