import WatchdogTimer from 'lib/watchdogTimer';
import { useProtocol } from 'config';

import CoreMqttConnector from 'core/mqttConnector';
import CoreHttpConnector from 'core/httpConnector';

global.initState = 'create-applicationEntity';

let coreConnector = null;

// Application Entity core
if(useProtocol === 'mqtt') {
    // WatchdogTimer.setWatchdogTimer('mqttConnector/initialize', 1, CoreMqttConnector.initialize);
} else {
    WatchdogTimer.setWatchdogTimer('httpConnector/initialize', 1, CoreHttpConnector.initialize);
}

global.restart = async () => {
    try {
        initState = 'create-applicationEntity';
        await WatchdogTimer.setWatchdogTimer('httpConnector/initialize', 1, coreConnector.initialize);
    } catch (error) {
        console.log(error);
    }
}