import ip from 'ip';
import Koa from 'koa';

import conf from 'config';
import WatchdogTimer from 'lib/watchdogTimer';
import ApplicationEntity from './applicationEntity';
import Container from './container';
import Subscription from './subscription';
import ThingAdationSoftwareConnector from 'core/thingAdationSoftwareConnector'

export default class HttpCore {

    constructor() {
        this.server = null;
        this.app = null;
        global.initState = 'create-applicationEntity';
    }

    initialize = async () => {
        this.app = new Koa();

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
                const { state } = await this.startHttpServer();
                initState = state;
            } else if(initState === 'start-tcpServer') {
                const { state } = await ThingAdationSoftwareConnector.initialize();
                initState = state;
            } else if(initState === 'ready') {
                console.log(`ADN-Application-Entity(${conf.applicationEntity.name}) is initialized`)
                WatchdogTimer.deleteWatchdogTimer('httpConnector/initialize');
            }
        } catch (error) {
            console.log(error);
        }
    }

    startHttpServer = () => {
        return new Promise(async (resolve, reject) => {
            const { app } = this;
            app.listen(conf.applicationEntity.port);
            console.log(`Http Server (${ip.address()}) for notification is listening on port ${conf.applicationEntity.port}`)
            resolve({state : 'start-tcpServer'});

            // this.server = Http.createServer(this.app);
            // this.server.listen(applicationEntity.port, function () {
            //     console.log(`Http Server (${ip.address()}) for notification is listening on port ${applicationEntity.port}`)
            //     resolve({state : 'start_tcpserver'});
            // });
        });
    }
}