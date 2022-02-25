import ip from 'ip';
import fs from 'fs';
import net from 'net';
import Twitter from 'twitter';
import shortid from 'shortid';

import config from 'config';
import ContentInstance from 'core/httpConnector/contentInstance';

let server = null;

let socketBuffer = {};
let thingAdationSoftwareBuffer = {};

async function thingAdationSoftwareConnectorHandler(data) {
    thingAdationSoftwareBuffer[this.id] += data.toString();
    let dataArray = thingAdationSoftwareBuffer[this.id].split('<EOF>');

    if(dataArray.length >= 2) {
        for (let i=0; i<dataArray.length-1; i++) {
            let line = dataArray[i];

            thingAdationSoftwareBuffer[this.id] = thingAdationSoftwareBuffer[this.id].replace(`${line}<EOF>`, '');

            let lineToJson = JSON.parse(line);
            let containerName = lineToJson.containerName;
            let content = lineToJson.content;

            socketBuffer[containerName] = this;

            console.log(`----> got data for [${containerName}] from thingAdationSoftware ---->`);

            if (content === 'hello') {
                this.write(`${line}<EOF>`);
            }
            else {
                for(let j = 0; j < config.containerArray.length; j++) {
                    if (config.containerArray[j].name === containerName) {
                        let parent = config.containerArray[j].parent + '/' + containerName;
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
    }
}

exports.sendTweet = (conteintInstanceObject) => {
    const twitterClient = new Twitter({
        consumer_key: 'tV4cipDkQcMzZh8RAWsEToDP2',
        consumer_secret: '1rAIO5DCuFnRkYVefjst2ULVStBl6Dfucs2AVBjo1pcSx8jROT',
        access_token_key: '4157451558-lo0rgStwJ3ewEi47TpmrWnoDBPIRB3hcHeNggEk',
        access_token_secret: 'KlmoKMSvcWPuX1mcmuOd1SIvh8DyLXQD9ja3NeMoVCzdl'
    });

    const params = {screen_name: 'gbsmfather'};
    twitterClient.get('statuses/user_timeline', params, function(error, tweets, response){
        if (!error) {
            console.log(tweets[0].text);
        }
    });

    const currentDate = new Date();
    const currentTimezoneOffset = currentDate.getTimezoneOffset() / (-60);
    currentDate.setHours(currentDate.getHours() + currentTimezoneOffset);
    const currentTime = currentDate.toISOString().replace(/\..+/, '');

    const contentArray = (conteintInstanceObject.content !== null ? conteintInstanceObject.content : conteintInstanceObject.content).split(',');

    if (contentArray[contentArray.length-1] !== null) {
        const bitmap = new Buffer(contentArray[contentArray.length-1], 'base64');
        fs.writeFileSync('decode.jpg', bitmap);

        twitterClient.post('media/upload', {media: bitmap}, function (error, media, response) {
            if (error) {
                console.log(error[0].message);
                return;
            }
            // If successful, a media object will be returned.
            console.log(media);

            // Lets tweet it
            const status = {
                status: '[' + currentTime + '] Give me water ! - ',
                media_ids: media.media_id_string // Pass the media id string
            };

            twitterClient.post('statuses/update', status, function (error, tweet, response) {
                if (!error) {
                    console.log(tweet.text);
                }
            });
        });
    }
};

exports.notification = (pathArray, conteintInstanceObject) => {
    let contentInstance = {};
    contentInstance.containerName = pathArray[pathArray.length-2];
    contentInstance.content = (conteintInstanceObject.con !== null) ? conteintInstanceObject.con : conteintInstanceObject.content;

    if(contentInstance.content == '') {
        console.log('---- is not contentInstance message');
    }
    else {
        console.log('<---- send to thingAdaptionSoftware');

        if (socketBuffer[pathArray[pathArray.length-2]] !== null) {
            socketBuffer[pathArray[pathArray.length-2]].write(JSON.stringify(contentInstance) + '<EOF>');
        }
    }
};

exports.initialize = () => {
    return new Promise((resolve, reject) => {
        try {
            server = net.createServer((socket) => {
                console.log('[thingAdationSoftware/app] : thingAdationSoftware socket connected');

                socket.id = shortid.generate();
                thingAdationSoftwareBuffer[socket.id] = '';
                
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
        } catch (error) {
            reject(error);
        }
    });
}