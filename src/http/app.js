import ip from 'ip';
import Koa from 'koa';
import Http from 'http';

import { ae } from 'conf';
import wdt from 'lib/wdt';

import HttpAe from './ae';
import HttpCnt from './cnt';
import HttpSub from './sub';

import ThingApp from 'thing/app'

export default class HttpCore {

    constructor() {
        this.server = null;
        this.app = null;
        this.initState = 'create_ae';
    }

    initialize = async () => {
        this.app = new Koa();

        console.log(`[initState] : ${this.initState}`);
        try {
            if (this.initState === 'create_ae') {
                const { state } = await HttpAe.createAE();
                this.initState = state;
            } else if(this.initState === 'retrieve_ae') {
                const { state } = await HttpAe.retrieveAE();
                this.initState = state;
            } else if(this.initState === 'create_cnt') {
                const { state } = await HttpCnt.createCntAll();
                this.initState = state;
            } else if(this.initState === 'delete_sub') {
                const { state } = await HttpSub.deleteSubAll();
                this.initState = state;
            } else if(this.initState === 'create_sub') {
                const { state } = await HttpSub.createSubAll();
                this.initState = state;
            } else if(this.initState === 'start_httpserver') {
                const { state } = await this.startHttpServer();
                this.initState = state;
            } else if(this.initState === 'start_tcpserver') {
                const { state } = await ThingApp.initialize();
                this.initState = state;
            } else if(this.initState === 'ready') {
                console.log(`ADN-AE(${ae.name}) is initialized`)
                wdt.del_wdt('http/app/initialize');
            }
        } catch (e) {
            console.log(e);
        }
    }

    startHttpServer = () => {
        return new Promise(async (resolve, reject) => {
            const { app } = this;
            app.listen(ae.port);
            console.log(`Http Server (${ip.address()}) for notification is listening on port ${ae.port}`)
            resolve({state : 'start_tcpserver'});

            // this.server = Http.createServer(this.app);
            // this.server.listen(ae.port, function () {
            //     console.log(`Http Server (${ip.address()}) for notification is listening on port ${ae.port}`)
            //     resolve({state : 'start_tcpserver'});
            // });
        });
    }
}