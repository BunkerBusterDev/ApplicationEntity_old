import ip from 'ip';
import Koa from 'koa';
import KoaRouter from 'koa-router';
import bodyParser from 'koa-bodyparser';

import config from 'config';
import {parseSgn} from './parseSgn';
import thingAdationSoftwareConnector from 'core/thingAdationSoftwareConnector';

const app = new Koa();
const router = new KoaRouter();

app.use(bodyParser());
app.use(router.routes());

router.post('/:resourcename0', (ctx) => {
    let requestBody = ctx.request.body;

    for(let i = 0; i < config.subscriptionArray.length; i++) {
        if(config.subscriptionArray[i]['nu'] !== undefined) {
            const urlSubscription = new URL(config.subscriptionArray[i].nu);
            if(urlSubscription.protocol === 'http:') {
                let nu_path = urlSubscription.pathname.toString().split('/')[1];
                if(nu_path === ctx.params.resourcename0) {

                    try {
                        let primitiveContent = requestBody;
                        let requestIdentifier = ctx.request.header['x-m2m-ri'];

                        httpNotificationAction(requestIdentifier, primitiveContent, 'json', ctx);
                    }
                    catch (error) {
                        console.log(error);
                    }
                    break;
                }
            }
        }
    }
});


const httpNotificationAction = (requestIdentifier, primitiveContent, bodyType, ctx) => {
    if(primitiveContent['m2m:sgn']) {
        primitiveContent.sgn = {};
        primitiveContent.sgn = primitiveContent['m2m:sgn'];
        delete primitiveContent['m2m:sgn'];
    }

    try {
        const { pathArray, contentInstanceObject } = parseSgn(primitiveContent);

        if(contentInstanceObject) {
            if(contentInstanceObject.sud || contentInstanceObject.vrq) {
                ctx.set('X-M2M-RSC', '2001');
                ctx.set('X-M2M-RI', requestIdentifier);
                ctx.status = 201;
                ctx.body = '<h1>success to receive notification</h1>';
            }
            else {
                for(let i=0; i<config.subscriptionArray.length; i++) {
                    if(config.subscriptionArray[i].parent.split('/')[config.subscriptionArray[i].parent.split('/').length - 1] === pathArray[pathArray.length - 2]) {
                        if(config.subscriptionArray[i].name === pathArray[pathArray.length - 1]) {
                            ctx.set('X-M2M-RSC', '2001');
                            ctx.set('X-M2M-RI', requestIdentifier);
                            ctx.status = 201
                            ctx.body = '<h1>success to receive notification</h1>';
                            
                            console.log(`http ${bodyType} notification <----`);
    
                            if(pathArray[pathArray.length - 2] === 'cnt-cam') {
                                thingAdationSoftwareConnector.sendTweet(contentInstanceObject);
                            }
                            else {
                                thingAdationSoftwareConnector.notification(pathArray, contentInstanceObject);
                            }
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
};

exports.start = () => {
    return new Promise((resolve, reject) => {
        app.listen(config.applicationEntity.port), () => {
            console.log(`Http Server(${ip.address()}) for notification is listening on port ${config.applicationEntity.port}`);
        };
        resolve({state : 'start-tcpServer'});
    });
}