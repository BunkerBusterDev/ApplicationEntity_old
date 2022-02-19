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
        this.initState = 'start_httpserver';
    }

    initialize = async () => {
        this.app = new Koa();

        console.log(`[initState] : ${this.initState}`);
        if (this.initState === 'create_ae') {
            try {
                const { state } = await HttpAe.createAE();
                this.initState = state;
            } catch (e) {
                console.log(e);
            }
        } else if(this.initState === 'retrieve_ae') {
            try {
                const { state } = await HttpAe.retrieveAE();
                this.initState = state;
            } catch (e) {
                console.log(e);
            }
        } else if(this.initState === 'create_cnt') {
            try {
                const { state } = await HttpCnt.createCntAll();
                this.initState = state;
            } catch (e) {
                console.log(e);
            }
        } else if(this.initState === 'delete_sub') {
            try {
                const { state } = await HttpSub.deleteSubAll();
                this.initState = state;
            } catch (e) {
                console.log(e);
            }
        } else if(this.initState === 'create_sub') {
            try {
                const { state } = await HttpSub.createSubAll();
                this.initState = state;
            } catch (e) {
                console.log(e);
            }
        } else if(this.initState === 'start_httpserver') {
            try {
                const { state } = await this.startHttpServer();
                this.initState = state;
            } catch (e) {
                console.log(e);
            }
        } else if(this.initState === 'start_tcpserver') {
            try {
                const thingApp = new ThingApp();
                const { state } = await thingApp.initialize();
                this.initState = state;
            } catch (e) {
                console.log(e);
            }
        } else if(this.initState === 'ready') {
            console.log(`ADN-AE(${ae.name}) is initialized`)
            wdt.del_wdt('http/app/initialize');
        }
    }

    startHttpServer = () => {
        return new Promise(async (resolve, reject) => {
            this.server = Http.createServer(this.app);
            this.server.listen(ae.port, function () {
                console.log(`Http Server (${ip.address()}) for notification is listening on port ${ae.port}`)
                resolve({state : 'start_tcpserver'});
            });
        });
    }
}