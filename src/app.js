import WatchdogTimer from 'lib/watchdogTimer';
import { useProtocol } from 'config';

import CoreMqttConnector from 'core/mqttConnector';
import CoreHttpConnector from 'core/httpConnector';

let coreConnector = null;

// Application Entity core
if(useProtocol === 'mqtt') {
    coreConnector = new CoreMqttConnector();
} else {
    coreConnector = new CoreHttpConnector();
    WatchdogTimer.setWatchdogTimer('httpConnector/initialize', 1, coreConnector.initialize);
}

global.restart = async () => {
    try {
        initState = 'create-applicationEntity';
        await WatchdogTimer.setWatchdogTimer('httpConnector/initialize', 1, coreConnector.initialize);
    } catch (error) {
        console.log(error);
    }
}