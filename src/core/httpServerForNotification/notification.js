
import config from 'config';
import thingAdationSoftwareConnector from 'core/thingAdationSoftwareConnector';

const parse_sgn = (primitiveContent) => {
    return new Promise((resolve, reject) => {
        let pathArray = '';
        let sgnObj = {};
        let contentInstanceObject = {};

        if(primitiveContent.sgn) {
            const nmtype = primitiveContent['sgn'] != null ? 'short' : 'long';
            sgnObj = primitiveContent['sgn'] != null ? primitiveContent['sgn'] : primitiveContent['singleNotification'];

            if (nmtype === 'long') {
                reject('oneM2M spec. define only short name for resource')
            }
            else { // 'short'
                if (sgnObj.sur) {
                    if(sgnObj.sur.charAt(0) != '/') {
                        sgnObj.sur = '/' + sgnObj.sur;
                    }
                    pathArray = sgnObj.sur.split('/');
                }

                if (sgnObj.nev) {
                    if (sgnObj.nev.rep) {
                        if (sgnObj.nev.rep['m2m:cin']) {
                            sgnObj.nev.rep.cin = sgnObj.nev.rep['m2m:cin'];
                            delete sgnObj.nev.rep['m2m:cin'];
                        }

                        if (sgnObj.nev.rep.cin) {
                            contentInstanceObject = sgnObj.nev.rep.cin;
                        }
                        else {
                            reject('[mqtt_noti_action] m2m:cin is none');
                            contentInstanceObject = null;
                        }
                    }
                    else {
                        reject('[mqtt_noti_action] rep tag of m2m:sgn.nev is none. m2m:notification format mismatch with oneM2M spec.');
                        contentInstanceObject = null;
                    }
                }
                else if (sgnObj.sud) {
                    console.log('[mqtt_noti_action] received notification of verification');
                    contentInstanceObject = {};
                    contentInstanceObject.sud = sgnObj.sud;
                }
                else if (sgnObj.vrq) {
                    console.log('[mqtt_noti_action] received notification of verification');
                    contentInstanceObject = {};
                    contentInstanceObject.vrq = sgnObj.vrq;
                }
                else {
                    reject('[mqtt_noti_action] nev tag of m2m:sgn is none. m2m:notification format mismatch with oneM2M spec.');
                    contentInstanceObject = null;
                }
            }
        }
        else {
            reject(`[mqtt_noti_action] m2m:sgn tag is none. m2m:notification format mismatch with oneM2M spec.\r\n${primitiveContent}`)
        }
        resolve({pathArray: pathArray, contentInstanceObject: contentInstanceObject});
    });
}
 
exports.httpNotificationAction = async (requestIdentifier, primitiveContent, bodyType, ctx) => {
    if(primitiveContent['m2m:sgn']) {
        primitiveContent.sgn = {};
        primitiveContent.sgn = primitiveContent['m2m:sgn'];
        delete primitiveContent['m2m:sgn'];
    }

    try {
        const { pathArray, contentInstanceObject } = await parse_sgn(primitiveContent);

        if (contentInstanceObject) {
            if(contentInstanceObject.sud || contentInstanceObject.vrq) {
                ctx.set('X-M2M-RSC', '2001');
                ctx.set('X-M2M-RI', requestIdentifier);
                ctx.status = 201;
                ctx.body = '<h1>success to receive notification</h1>';
            }
            else {
                for (let i=0; i<config.subscriptionArray.length; i++) {
                    if (config.subscriptionArray[i].parent.split('/')[config.subscriptionArray[i].parent.split('/').length - 1] === pathArray[pathArray.length - 2]) {
                        if (config.subscriptionArray[i].name === pathArray[pathArray.length - 1]) {
                            ctx.set('X-M2M-RSC', '2001');
                            ctx.set('X-M2M-RI', requestIdentifier);
                            ctx.status = 201
                            ctx.body = '<h1>success to receive notification</h1>';
                            
                            console.log('http ' + bodyType + ' notification <----');
    
                            if (pathArray[pathArray.length - 2] === 'cnt-cam') {
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
