import shortid from 'shortid';

import config from 'config';
import MqttClient from './mqttClient';

const applicationEntityResponseAction = (responseStatusCode, primitiveContent) => {
    const applicationEntityID = primitiveContent['m2m:ae']['aei'];

    console.log('x-m2m-rsc : ' + responseStatusCode + ' - ' + applicationEntityID + ' <----');

    let topicObject = MqttClient.getTopic();

    config.applicationEntity.id = applicationEntityID;

    MqttClient.unSubscribe(topicObject['requestTopic']);
    MqttClient.unSubscribe(topicObject['responseTopic']);
    MqttClient.unSubscribe(topicObject['registrationResponseTopic']);
    MqttClient.unSubscribe(topicObject['notificationTopic']);

    topicObject['requestTopic'] = `/oneM2M/reg_resp/${config.applicationEntity.id}/+/#`;
    topicObject['responseTopic'] = `/oneM2M/req/${config.applicationEntity.id}/+/${config.applicationEntity.bodyType}`;
    topicObject['registrationResponseTopic'] = `/oneM2M/resp/${config.applicationEntity.id}/+/#`;
    topicObject['notificationTopic'] = `/oneM2M/req/+/${config.applicationEntity.id}/#`;

    
    MqttClient.subscribe(topicObject['requestTopic']);
    MqttClient.subscribe(topicObject['responseTopic']);
    MqttClient.subscribe(topicObject['registrationResponseTopic']);
    MqttClient.subscribe(topicObject['notificationTopic']);
}

exports.createApplicationEntity =  () => {
    return new Promise((resolve, reject) => {
        const requestIdentifier = shortid.generate();

        let requestMessage = {};
        requestMessage['m2m:rqp'] = {};
        requestMessage['m2m:rqp'].op = '1'; // create
        requestMessage['m2m:rqp'].to = config.applicationEntity.parent;
        requestMessage['m2m:rqp'].fr = config.applicationEntity.id;
        requestMessage['m2m:rqp'].rqi = requestIdentifier;
        requestMessage['m2m:rqp'].ty = '2'; // applicationEntity
        requestMessage['m2m:rqp'].pc = {};
        requestMessage['m2m:rqp'].pc['m2m:ae'] = {};
        requestMessage['m2m:rqp'].pc['m2m:ae'].rn = config.applicationEntity.name;
        requestMessage['m2m:rqp'].pc['m2m:ae'].api = config.applicationEntity.appID;
        requestMessage['m2m:rqp'].pc['m2m:ae'].rr = 'true';

        MqttClient.publish('requestTopic', JSON.stringify(requestMessage['m2m:rqp']), requestIdentifier, (responseStatusCode, primitiveContent) => {
            if(responseStatusCode === 2001) {
                applicationEntityResponseAction(responseStatusCode, primitiveContent);
                resolve({state: 'create-Cotainer'});
            }
            else if(responseStatusCode === 5106 || responseStatusCode === 4105) {
                console.log(`x-m2m-rsc : ${responseStatusCode} <----`);
                resolve({state: 'retrieve-applicationEntity'});
            } else {
                reject(`${responseStatusCode} --> ${primitiveContent}`);
            }
        });
    });
}

exports.retrieveApplicationEntity = () => {
    return new Promise((resolve, reject) => {
        const requestIdentifier = shortid.generate();
    
        let requestMessage = {};
        requestMessage['m2m:rqp'] = {};
        requestMessage['m2m:rqp'].op = '2'; // retrieve
        requestMessage['m2m:rqp'].to = `${config.applicationEntity.parent}/${config.applicationEntity.name}`;
        requestMessage['m2m:rqp'].fr = config.applicationEntity.id;
        requestMessage['m2m:rqp'].rqi = requestIdentifier;
        requestMessage['m2m:rqp'].pc = {};
    
        
        MqttClient.publish('requestTopic', JSON.stringify(requestMessage['m2m:rqp']), requestIdentifier, (responseStatusCode, primitiveContent) => {
            if(responseStatusCode === 2000) {
                let applicationEntityID = primitiveContent['m2m:ae']['aei'];
                console.log(`x-m2m-rsc : ${responseStatusCode} - ${applicationEntityID} <----`);

                if(config.applicationEntity.id != applicationEntityID && config.applicationEntity.id != ('/'+applicationEntityID)) {
                    reject('applicationEntityID created is ' + applicationEntityID + ' not equal to device applicationEntityID is ' + config.applicationEntity.id);
                }
                else {
                    resolve({state: 'create-container'});
                }
            } else {
                reject('x-m2m-rsc : ' + responseStatusCode + ' <----');
            }
        });
    });
}