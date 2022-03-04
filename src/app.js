import WatchdogTimer from 'lib/watchdogTimer';
import config from 'config';

import coreMqttConnector from 'core/mqttConnector';
import coreHttpConnector from 'core/httpConnector';

// Application Entity core
if(config.useProtocol === 'mqtt') {
    WatchdogTimer.setWatchdogTimer('mqttConnector/initialize', 1, coreMqttConnector.initialize);
} else {
    WatchdogTimer.setWatchdogTimer('httpConnector/initialize', 1, coreHttpConnector.initialize);
}