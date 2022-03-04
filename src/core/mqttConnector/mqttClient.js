import mqtt from 'mqtt';

import config from 'config';
import Notification from 'core/notification/mqttForNotification'

let mqttClient;

let callbackQueue = {};
let responseMqttRequestIdentifierArray = [];

let topicObject = {};

const mqttMessageHandler = (topic, message) => {
    const topicArray = topic.split("/");

    if(topicArray[1] === 'oneM2M') {
        if((topicArray[2] === 'resp' || topicArray[2] === 'reg_resp')) {
            if(topicArray[3].replace(':', '/') === config.applicationEntity.id) {
                let messageToJson = JSON.parse(message.toString());
    
                if(messageToJson['m2m:rsp'] === undefined) {
                    messageToJson['m2m:rsp'] = messageToJson;
                }
        
                for(let i = 0; i < responseMqttRequestIdentifierArray.length; i++) {
                    if(responseMqttRequestIdentifierArray[i] === messageToJson['m2m:rsp'].rqi) {
                        const returnCallback = callbackQueue[responseMqttRequestIdentifierArray[i]];
                        returnCallback(messageToJson['m2m:rsp'].rsc, messageToJson['m2m:rsp'].pc);
                        delete callbackQueue[responseMqttRequestIdentifierArray[i]];
                        responseMqttRequestIdentifierArray.splice(i, 1);
                        break;
                    }
                }
            };
        }
        else if(topicArray[2] === 'req') {
            if(topicArray[4] === config.applicationEntity.id) {
                let messageToJson = JSON.parse(message.toString());
        
                if(messageToJson['m2m:rqp'] === undefined) {
                    messageToJson['m2m:rqp'] = messageToJson;
                }
        
                Notification.mqttNotificationAction(topicArray, messageToJson);
            }
        }
    }
    else {
        console.log('topic is not supported');
    }
}

exports.setTopic = (topicName, topicString) => {
    topicObject[`${topicName}`] = topicString;
}

exports.getTopic = (topicName) => {
    if(topicName) {
        return topicObject[`${topicName}`];
    } else {
        return topicObject;
    }
}

exports.publish = (topic, message, requestIdentifier, callback) => {
    callbackQueue[requestIdentifier] = callback;
    responseMqttRequestIdentifierArray.push(requestIdentifier);

    let toTopic = '';

    if(topic==='requestTopic' || topic==='responseTopic') {
        toTopic = topicObject[topic];
    } else {
        toTopic = topic;
    }

    mqttClient.publish(toTopic, message);
    console.log(`${toTopic} (json) ${message} ---->`);
}

exports.subscribe = (topic) => {
    mqttClient.subscribe(topic);
}

exports.unSubscribe = (topic) => {
    mqttClient.unsubscribe(topic);
}

exports.start = () => {
    return new Promise((resolve, reject) => {
        const requestTopic = `/oneM2M/req/${config.applicationEntity.id}${config.commonServiceEntity.id}/${config.applicationEntity.bodyType}`;
        const responseTopic = `/oneM2M/resp/${config.applicationEntity.id}/+/#`;
        const registrationResponseTopic = `/oneM2M/reg_resp/${config.applicationEntity.id}/+/#`;
        const notificationTopic = `/oneM2M/req/+/${config.applicationEntity.id}/#`;
        topicObject.requestTopic = requestTopic;
        topicObject.responseTopic = responseTopic;
        topicObject.registrationResponseTopic = registrationResponseTopic;
        topicObject.notificationTopic = notificationTopic;

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
            mqttClient.subscribe(topicObject.registrationResponseTopic);
            mqttClient.subscribe(topicObject.responseTopic);
            mqttClient.subscribe(topicObject.notificationTopic);
            console.log(`subscribe registrationResponseTopic as ${topicObject.registrationResponseTopic}`);
            console.log(`subscribe responseTopic as ${topicObject.responseTopic}`);
            console.log(`subscribe notificationTopic as ${topicObject.notificationTopic}`);

            resolve({state: 'create-applicationEntity'});
        });
        mqttClient.on('message', mqttMessageHandler);
    });
}