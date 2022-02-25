import MqttClient from './mqttClient';
import ApplicationEntity from './applicationEntity';

let initState = 'initialize-mqttClient';

exports.initialize = async () => {
    console.log(`[initState] : ${initState}`);

    try {
        if(initState === 'initialize-mqttClient') {
            const { state } = await MqttClient.initialize();
            initState = state;
        }
        if (initState === 'create-applicationEntity') {
            const { state } = await ApplicationEntity.createApplicationEntity();
            initState = state;
        } else if(initState === 'retrieve-applicationEntity') {
            console.log(initState);
        } else if(initState === 'create-container') {
            console.log(initState);
        } else if(initState === 'delete-subscription') {
            console.log(initState);
        } else if(initState === 'create-subscription') {
            console.log(initState);
        } else if(initState === 'start-httpServer') {
            console.log(initState);
        } else if(initState === 'start-tcpServer') {
            console.log(initState);
        } else if(initState === 'ready') {
            console.log(initState);
        }
    } catch (error) {
        console.log(error);
    }
}