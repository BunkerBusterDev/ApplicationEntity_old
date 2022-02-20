import ip from 'ip';
import net from 'net';
import shortid from 'shortid';

import { ae, cnt } from 'conf';

let server = null;

let socket_buffer = {};
let data_buffer = {};

function thing_handler(data) {
    data_buffer[this.id] += data.toString();
    let data_arr = data_buffer[this.id].split('<EOF>');

    if(data_arr.length >= 2) {
        for (let i=0; i<data_arr.length-1; i++) {
            let line = data_arr[i];

            data_buffer[this.id] = data_buffer[this.id].replace(`${line}<EOF>`, '');

            let jsonObj = JSON.parse(line);
            let cntname = jsonObj.cntname;
            let content = jsonObj.con;

            socket_buffer[cntname] = this;

            console.log(`----> got data for [${cntname}] from thing ---->`);

            if (jsonObj.con === 'hello') {
                this.write(`${line}<EOF>`);
            }
            else {
                
            }
        }
    }
}

exports.initialize = () => {
    return new Promise(async (resolve, reject) => {
        server = net.createServer((socket) => {
            console.log('[thing/app] : thing socket connected');

            socket.id = shortid.generate();
            data_buffer[socket.id] = '';
            
            socket.on('data', thing_handler);
            socket.on('end', function() {
                console.log('[thing/app] : thing socket end');
            });
            socket.on('close', function() {
                console.log('[thing/app] : thing socket close');
            });
            socket.on('error', function(e) {
                console.log(`[thing/app] : problem with tcp server: ${e.message}`);
            });
        });

        server.listen(ae.thingPort, () => {
            console.log(`TCP Server (${ip.address()}) for things is listening on port ${ae.thingPort}`)
            resolve({state: 'ready'});
        });
    });
}