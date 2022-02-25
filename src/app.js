import WatchdogTimer from 'lib/watchdogTimer';
import { useProtocol } from 'config';

import coreMqttConnector from 'core/mqttConnector';
import coreHttpConnector from 'core/httpConnector';

// Application Entity core
if(useProtocol === 'mqtt') {
    WatchdogTimer.setWatchdogTimer('mqttConnector/initialize', 1, coreMqttConnector.initialize);
} else {
    WatchdogTimer.setWatchdogTimer('httpConnector/initialize', 1, coreHttpConnector.initialize);
}