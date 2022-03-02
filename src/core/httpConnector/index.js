import config from 'config';
import WatchdogTimer from 'lib/watchdogTimer';
import ApplicationEntity from './applicationEntity';
import Container from './container';
import Subscription from './subscription';
import Notification from 'core/notification'
import ThingAdationSoftwareConnector from 'core/thingAdationSoftwareConnector'

let initState = 'create-applicationEntity';

exports.initialize = async () => {
    console.log(`[initState] : ${initState}`);
    try {
        if(initState === 'create-applicationEntity') {
            const { state } = await ApplicationEntity.createApplicationEntity();
            initState = state;
        } else if(initState === 'retrieve-applicationEntity') {
            const { state } = await ApplicationEntity.retrieveApplicationEntity();
            initState = state;
        } else if(initState === 'create-container') {
            const { state } = await Container.createContainerAll();
            initState = state;
        } else if(initState === 'delete-subscription') {
            const { state } = await Subscription.deleteSubscriptionAll();
            initState = state;
        } else if(initState === 'create-subscription') {
            const { state } = await Subscription.createSubscriptionAll();
            initState = state;
        } else if(initState === 'start-httpServer') {
            const { state } = await Notification.start();
            initState = state;
        } else if(initState === 'start-tcpServer') {
            const { state } = await ThingAdationSoftwareConnector.start();
            initState = state;
        } else if(initState === 'ready') {
            console.log(`ApplicationEntity(${config.applicationEntity.name}) is initialized`)
            WatchdogTimer.deleteWatchdogTimer('httpConnector/initialize');
        }
    } catch (error) {
        console.log(error);
    }
}

exports.restart = function() {
    initState = 'create-applicationEntity';
    WatchdogTimer.setWatchdogTimer('httpConnector/initialize', 1, this.initialize);
}