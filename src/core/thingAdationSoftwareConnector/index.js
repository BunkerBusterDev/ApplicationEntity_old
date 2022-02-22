import ip from 'ip';
import net from 'net';
import shortid from 'shortid';

import config from 'config';
import { sleep } from 'lib/sleep';
import ContentInstance from 'core/httpConnector/contentInstance';

let server = null;

let socketBuffer = {};
let dataBuffer = {};

async function thingAdationSoftwareConnectorHandler(data) {
    dataBuffer[this.id] += data.toString();
    let dataArray = dataBuffer[this.id].split('<EOF>');

    if(dataArray.length >= 2) {
        for (let i=0; i<dataArray.length-1; i++) {
            let line = dataArray[i];

            dataBuffer[this.id] = dataBuffer[this.id].replace(`${line}<EOF>`, '');

            let lineToJson = JSON.parse(line);
            let containerName = lineToJson.containerName;
            let content = lineToJson.content;

            socketBuffer[containerName] = this;

            console.log(`----> got data for [${containerName}] from thingAdationSoftware ---->`);

            if (content === 'hello') {
                this.write(`${line}<EOF>`);
            }
            else {
                if(initState === 'ready') {
                    for(let j = 0; j < config.containerArray.length; j++) {
                        if (config.containerArray[j].name === containerName) {
                            let parent = config.containerArray[j].parent + '/' + config.containerArray[j].name;
                            try {
                                await ContentInstance.createContentInstance(parent, content, this);
                                break;
                            } catch (error) {
                                console.log(error);
                            }
                        }
                    }
                }
            }

            sleep(100);
        }
    }
}

exports.initialize = () => {
    return new Promise(async (resolve, reject) => {
        server = net.createServer((socket) => {
            console.log('[thingAdationSoftware/app] : thingAdationSoftware socket connected');

            socket.id = shortid.generate();
            dataBuffer[socket.id] = '';
            
            socket.on('data', thingAdationSoftwareConnectorHandler);
            socket.on('end', function() {
                console.log('[thingAdationSoftware/app] : thingAdationSoftware socket end');
            });
            socket.on('close', function() {
                console.log('[thingAdationSoftware/app] : thingAdationSoftware socket close');
            });
            socket.on('error', function(error) {
                console.log(`[thingAdationSoftware/app] : problem with tcp server: ${error.message}`);
            });
        });

        server.listen(config.applicationEntity.thingPort, () => {
            console.log(`TCP Server (${ip.address()}) for things is listening on port ${config.applicationEntity.thingPort}`)
            resolve({state: 'ready'});
        });
    });
}