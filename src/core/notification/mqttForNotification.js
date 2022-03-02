import config from 'config';
import {parseSgn} from './parseSgn';
import MqttClient from 'core/mqttConnector/mqttClient';
import thingAdationSoftwareConnector from 'core/thingAdationSoftwareConnector';

const responseMqtt = (responseTopic, responseStatusCode, responseTo, responseFrom, requestIdentifier, primitiveContent) => {
    let responseMessage = {};
    responseMessage['m2m:rsp'] = {};
    responseMessage['m2m:rsp'].rsc = responseStatusCode;
    responseMessage['m2m:rsp'].to = responseTo;
    responseMessage['m2m:rsp'].fr = responseFrom;
    responseMessage['m2m:rsp'].rqi = requestIdentifier;
    responseMessage['m2m:rsp'].pc = primitiveContent;
    
    MqttClient.publish(responseTopic, JSON.stringify(responseMessage['m2m:rsp']));
}

exports.mqttNotificationAction = async (topicArray, messageToJson) => {
    if(messageToJson !== undefined) {
        let bodyType = config.applicationEntity.bodyType;
        if(topicArray[5] !== undefined) {
            bodyType = topicArray[5];
        }

        const requestIdentifier = (messageToJson['m2m:rqp']['rqi'] === undefined) ? '' : messageToJson['m2m:rqp']['rqi'];
        const primitiveContent = (messageToJson['m2m:rqp']['pc'] === undefined) ? {} : messageToJson['m2m:rqp']['pc'];

        if(primitiveContent['m2m:sgn']) {
            primitiveContent.sgn = {};
            primitiveContent.sgn = primitiveContent['m2m:sgn'];
            delete primitiveContent['m2m:sgn'];
        }
        
        const { pathArray, contentInstanceObject } = parseSgn(primitiveContent);

        if(contentInstanceObject) {
            if(contentInstanceObject.sud || contentInstanceObject.vrq) {
                const responseTopic = `/oneM2M/resp/${topicArray[3]}/${topicArray[4]}/${topicArray[5]}`;
                responseMqtt(responseTopic, 2001, '', config.applicationEntity.id, requestIdentifier, '', topicArray[5]);
            }
            else {
                for(var i = 0; i < config.subscriptionArray.length; i++) {
                    if(config.subscriptionArray[i].parent.split('/')[config.subscriptionArray[i].parent.split('/').length-1] === pathArray[pathArray.length-2]) {
                        if(config.subscriptionArray[i].name === pathArray[pathArray.length-1]) {
                            console.log(`mqtt ${bodyType} notification <----`);

                            const responseTopic = `/oneM2M/resp/${topicArray[3]}/${topicArray[4]}/${topicArray[5]}`;
                            responseMqtt(responseTopic, 2001, '', config.applicationEntity.id, requestIdentifier, '', topicArray[5]);
                            console.log('mqtt response - 2001 ---->');

                            if(pathArray[pathArray.length - 2] === 'cnt-cam') {
                                thingAdationSoftwareConnector.sendTweet(contentInstanceObject);
                            }
                            else {
                                thingAdationSoftwareConnector.notification(pathArray, contentInstanceObject);
                            }
                            break;
                        }
                    }
                }
            }
        }
    }
    else {
        console.log('[mqtt_noti_action] message is not noti');
    }
};

exports.start = () => {
    return new Promise((resolve, reject) => {
        resolve({state : 'start-tcpServer'});
    });
}