import shortid from 'shortid';

import config from 'config';
import MqttClient from './mqttClient';

exports.createContentInstance = (parent, content, socket) => {
    return new Promise((resolve, reject) => {
        const requestIdentifier = shortid.generate();

        let requestMessage = {};
        requestMessage['m2m:rqp'] = {};
        requestMessage['m2m:rqp'].op = '1'; // create
        requestMessage['m2m:rqp'].to = parent;
        requestMessage['m2m:rqp'].fr = config.applicationEntity.id;
        requestMessage['m2m:rqp'].rqi = requestIdentifier;
        requestMessage['m2m:rqp'].ty = '4'; // cin
        requestMessage['m2m:rqp'].pc = {};
        requestMessage['m2m:rqp'].pc['m2m:cin'] = {};
        requestMessage['m2m:rqp'].pc['m2m:cin'].con = content;

        MqttClient.publish('requestTopic', JSON.stringify(requestMessage['m2m:rqp']), requestIdentifier, (responseStatusCode) => {
            try {
                let parentArray = parent.split('/');
                let containerName = parentArray[parentArray.length-1];
                let result = {};
                result.containerName = containerName;
                result.content = responseStatusCode;
    
                console.log(`<---- x-m2m-rsc : ${responseStatusCode} <----`);
                if(responseStatusCode === 5106 || responseStatusCode === 2001 || responseStatusCode == 4105) {
                    socket.write(JSON.stringify(result) + '<EOF>');
                    resolve(true);
                }
                else if(responseStatusCode === 5000) {
                    httpConnector.restart();
                    socket.write(JSON.stringify(result) + '<EOF>');
                    reject();
                }
                else if(responseStatusCode === 9999) {
                    socket.write(JSON.stringify(result) + '<EOF>');
                    reject();
                }
                else {
                    socket.write(JSON.stringify(result) + '<EOF>');
                    reject();
                }
            }
            catch (error) {
                reject(error.message);
            }
        });
    });
}