import mqtt from 'mqtt';

import config from 'config';

let mqttClient;

let callbackQueue = {};
let responseMqttRequestIdentifierArray = [];

const requestTopic = `/oneM2M/req/${config.applicationEntity.id}${config.commonServiceEntity.id}/${config.applicationEntity.bodyType}`;
const responseTopic = `/oneM2M/resp/${config.applicationEntity.id}/+/#`;
const registrationResponseTopic = `/oneM2M/reg_resp/${config.applicationEntity.id}/+/#`;
const notificationTopic = `/oneM2M/req/+/${config.applicationEntity.id}/#`;

const mqttMessageHandler = (topic, message) => {
    const topicArray = topic.split("/");

    if(topicArray[1] === 'oneM2M') {
        if((topicArray[2] === 'resp' || topicArray[2] === 'reg_resp')) {
            if(topicArray[3].replace(':', '/') === config.applicationEntity.id) {
                let messageToJson = JSON.parse(message.toString());
    
                if (messageToJson['m2m:rsp'] === undefined) {
                    messageToJson['m2m:rsp'] = messageToJson;
                }
        
                for (let i = 0; i < responseMqttRequestIdentifierArray.length; i++) {
                    if (responseMqttRequestIdentifierArray[i] === messageToJson['m2m:rsp'].rqi) {
                        const returnCallback = callbackQueue[responseMqttRequestIdentifierArray[i]];
                        returnCallback(messageToJson['m2m:rsp'].rsc, messageToJson['m2m:rsp'].pc);
                        delete callbackQueue[responseMqttRequestIdentifierArray[i]];
                        responseMqttRequestIdentifierArray.splice(i, 1);
                        break;
                    }
                }
            };
        }
        else if(topicArray[2] == 'req') {
            if(topicArray[4] == config.applicationEntity.id) {
                let messageToJson = JSON.parse(message.toString());
        
                if (messageToJson['m2m:rqp'] == null) {
                    messageToJson['m2m:rqp'] = messageToJson;
                }
        
                // noti.mqtt_noti_action(topicArray, messageToJson);
            }
        }
    }
    else {
        console.log('topic is not supported');
    }
}

exports.publish = (message, requestIdentifier, callback) => {
    callbackQueue[requestIdentifier] = callback;
    responseMqttRequestIdentifierArray.push(requestIdentifier);
    mqttClient.publish(requestTopic, message);
    console.log(`${requestTopic} (json) ---->`);
}

exports.subscribe = () => {
    return new Promise((resolve, reject) => {
        
    });
}

exports.initialize = () => {
    return new Promise((resolve, reject) => {
        const connectOptions = {
            host: config.commonServiceEntity.host,
            port: config.commonServiceEntity.mqttPort,
            // username: 'witlab',
            // password: 'witlab123',
            protocol: "mqtt",
            keepalive: 10,
            // clientId: serverUID,
            protocolId: "MQTT",
            protocolVersion: 4,
            clean: true,
            reconnectPeriod: 2000,
            connectTimeout: 2000,
            rejectUnauthorized: false
        };

        mqttClient = mqtt.connect(connectOptions);

        mqttClient.on('connect', () => {
            mqttClient.subscribe(registrationResponseTopic);
            mqttClient.subscribe(responseTopic);
            mqttClient.subscribe(notificationTopic);
            console.log(`subscribe registrationResponseTopic as ${registrationResponseTopic}`);
            console.log(`subscribe responseTopic as ${responseTopic}`);
            console.log(`subscribe notificationTopic as ${notificationTopic}`);

            mqttClient.on('message', mqttMessageHandler);
            resolve({state: 'create-applicationEntity'});
        });
    });
}