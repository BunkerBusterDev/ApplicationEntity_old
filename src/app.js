import WatchdogTimer from 'lib/watchdogTimer';
import { useProtocol } from 'config';

// import CoreMqttConnector from 'core/mqttConnector';
import CoreHttpConnector from 'core/httpConnector';

// Application Entity core
if(useProtocol === 'mqtt') {
    // WatchdogTimer.setWatchdogTimer('mqttConnector/initialize', 1, CoreMqttConnector.initialize);
} else {
    WatchdogTimer.setWatchdogTimer('httpConnector/initialize', 1, CoreHttpConnector.initialize);
}