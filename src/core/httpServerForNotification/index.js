import ip from 'ip';
import url from 'Url';
import Koa from 'koa';
import KoaRouter from 'koa-router';
import bodyParser from 'koa-bodyparser';

import config from 'config';
import notification from './notification';

const app = new Koa();
const router = new KoaRouter();

app.use(bodyParser());
app.use(router.routes());

router.post('/:resourcename0', (ctx) => {
    let requestBody = ctx.request.body;

    for (let i = 0; i < config.subscriptionArray.length; i++) {
        if (config.subscriptionArray[i]['nu'] != null) {
            if(url.parse(config.subscriptionArray[i].nu).protocol === 'http:') {
                let nu_path = url.parse(config.subscriptionArray[i]['nu']).pathname.toString().split('/')[1];
                if (nu_path === ctx.params.resourcename0) {

                    try {
                        let primitiveContent = requestBody;
                        let requestIdentifier = ctx.request.header['x-m2m-ri'];

                        notification.httpNotificationAction(requestIdentifier, primitiveContent, 'json', ctx);
                    }
                    catch (e) {
                        console.log(e);
                    }
                    break;
                }
            }
        }
    }
});

exports.start = () => {
    return new Promise((resolve, reject) => {
        app.listen(config.applicationEntity.port), () => {
            console.log(`Http Server(${ip.address()}) for notification is listening on port ${config.applicationEntity.port}`)
        };
        resolve({state : 'start-tcpServer'});
    });
}