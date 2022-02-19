import ip from 'ip';
import net from 'net';
import shortid from 'shortid';

import { ae, cnt } from 'conf';

export default class ThingApp {

    constructor() {
        this.server = null;

        this.socket_buffer = {};
        this.data_buffer = {};
    }

    initialize() {
        return new Promise(async (resolve, reject) => {
            this.server = net.createServer((socket) => {
                console.log('thing socket connected');

                socket.id = shortid.generate();
                data_buffer[socket.id] = '';
                
                socket.on('data', thing_handler);
                socket.on('end', function() {
                    console.log('end');
                });
                socket.on('close', function() {
                    console.log('close');
                });
                socket.on('error', function(e) {
                    console.log(`[thing/app] : problem with tcp server: ${e.message}`);
                });
            });

            this.server.listen(ae.thingport, () => {
                console.log(`TCP Server (${ip.address()}) for things is listening on port ${ae.thingport}`)
                resolve({state: 'ready'});
            });
        });
    }

    thing_handler(data) {
        this.data_buffer[this.id] += data.toString();
        let data_arr = this.data_buffer[this.id].split('<EOF>');

        if(data_arr.length >= 2) {
            for (let i=0; i<data_arr.length-1; i++) {
                let line = data_arr[i];

                data_buffer[this.id] = data_buffer[this.id].replace(`${line}<EOF>`, '');

                let jsonObj = JSON.parse(line);
                let ctname = jsonObj.ctname;
                let content = jsonObj.con;
    
                socket_buffer[ctname] = this;
    
                console.log(`----> got data for [${ctname}] from thing ---->`);
    
                if (jsonObj.con === 'hello') {
                    this.write(`${line}<EOF>`);
                }
                else {
                    
                }
            }
        }
    }
}