import shortid from 'shortid';

import config from 'config';
import MqttClient from './mqttClient';


exports.createApplicationEntity =  () => {
    return new Promise((resolve, reject) => {
        const requestIdentifier = shortid.generate();

        let requestMessage = {};
        requestMessage['m2m:rqp'] = {};
        requestMessage['m2m:rqp'].op = '1'; // create
        requestMessage['m2m:rqp'].to = config.applicationEntity.parent;
        requestMessage['m2m:rqp'].fr = config.applicationEntity.id;
        requestMessage['m2m:rqp'].rqi = requestIdentifier;
        requestMessage['m2m:rqp'].ty = '2'; // ae
        requestMessage['m2m:rqp'].pc = {};
        requestMessage['m2m:rqp'].pc['m2m:ae'] = {};
        requestMessage['m2m:rqp'].pc['m2m:ae'].rn = config.applicationEntity.name;
        requestMessage['m2m:rqp'].pc['m2m:ae'].api = config.applicationEntity.appID;
        requestMessage['m2m:rqp'].pc['m2m:ae'].rr = 'true';

        MqttClient.publish(JSON.stringify(requestMessage['m2m:rqp']), requestIdentifier, (rsponseStatusCode, primitiveContent) => {
            if(rsponseStatusCode === 2001) {
                ae_response_action(rsponseStatusCode, primitiveContent);
                resolve({state: 'create-Cotainer'});
            }
            else if(rsponseStatusCode === 5106 || rsponseStatusCode === 4105) {
                console.log(`x-m2m-rsc : ${rsponseStatusCode} <----`);
                resolve({state: 'retrieve-applicationEntity'});
            }
        });
    });
}

exports.retrieveApplicationEntity = () => {
    return new Promise((resolve, reject) => {

       
    });
}