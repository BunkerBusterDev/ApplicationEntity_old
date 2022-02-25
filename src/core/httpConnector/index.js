import config from 'config';
import WatchdogTimer from 'lib/watchdogTimer';
import ApplicationEntity from './applicationEntity';
import Container from './container';
import Subscription from './subscription';
import HttpServerForNotification from 'core/httpServerForNotification'
import ThingAdationSoftwareConnector from 'core/thingAdationSoftwareConnector'

let initState = 'create-applicationEntity';

exports.initialize = async () => {
    console.log(`[initState] : ${initState}`);
    try {
        if (initState === 'create-applicationEntity') {
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
            const { state } = await HttpServerForNotification.start();
            initState = state;
        } else if(initState === 'start-tcpServer') {
            const { state } = await ThingAdationSoftwareConnector.initialize();
            initState = state;
        } else if(initState === 'ready') {
            console.log(`ADN-Application-Entity(${config.applicationEntity.name}) is initialized`)
            WatchdogTimer.deleteWatchdogTimer('httpConnector/initialize');
        }
    } catch (error) {
        console.log(error);
    }
}

global.restart = () => {
    initState = 'create-applicationEntity';
    WatchdogTimer.setWatchdogTimer('httpConnector/initialize', 1, this.initialize);
}