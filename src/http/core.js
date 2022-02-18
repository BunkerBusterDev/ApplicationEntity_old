import Koa from 'koa';
import Http from 'http';

import { ae } from 'conf';
import wdt from 'lib/wdt';

import HttpAe from './ae';
import HttpCnt from './cnt';
import HttpSub from './sub';

export default class HttpCore {

    constructor() {
        this.initState = 'create_ae';
        wdt.set_wdt('initDevice', 2, this.initDevice);

        this.server = null;
        this.app = new Koa();
    }

    readyForNotification = () => {
        this.server = Http.createServer(this.app);
        this.server.listen(ae.port, function () {
            console.log('http_server running at ' + ae.port + ' port');
        });
    }

    initDevice = async () => {
        if (this.initState === 'create_ae') {
            console.log('[initState] : ' + this.initState);
            try {
                const { state } = await HttpAe.createAE();
                this.initState = state;
            } catch (e) {
                console.log(e);
            }
        } else if(this.initState === 'retrieve_ae') {
            console.log('[initState] : ' + this.initState);
            try {
                const { state } = await HttpAe.retrieveAE();
                this.initState = state;
            } catch (e) {
                console.log(e);
            }
        } else if(this.initState === 'create_cnt') {
            console.log('[initState] : ' + this.initState);
            try {
                const { state } = await HttpCnt.createCntAll();
                this.initState = state;
            } catch (e) {
                console.log(e);
            }
        } else if(this.initState === 'delete_sub') {
            console.log('[initState] : ' + this.initState);
            try {
                const { state } = await HttpSub.deleteSubAll();
                this.initState = state;
            } catch (e) {
                console.log(e);
            }
        } else if(this.initState === 'create_sub') {
            console.log('[initState] : ' + this.initState);
            try {
                const { state } = await HttpSub.createSubAll();
                this.initState = state;
            } catch (e) {
                console.log(e);
            }
        } else if('ready') {
            console.log('[initState] : ' + this.initState);
            wdt.del_wdt('initDevice');
            this.readyForNotification();
        }
    }
}