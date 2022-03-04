import config from 'config';
import request from './requestAxios';
// import request from './requestHttp';

let requestCount = 0;

const deleteSubscription = (target) => {
    return new Promise((resolve, reject) => {
        request.delete(target).then(({responseStatusCode, responseBody}) => {
            resolve({responseStatusCode: responseStatusCode, responseBody: responseBody});
        }).catch (error => {
            reject(error);
        });
    });
}

exports.deleteSubscriptionAll = () => {
    return new Promise((resolve, reject) => {
        if(config.subscriptionArray.length === 0) {
            resolve({state: 'create-subscription'});
        }
        else {
            const target = `${config.subscriptionArray[requestCount].parent}/${config.subscriptionArray[requestCount].name}`;
            deleteSubscription(target).then(({responseStatusCode, responseBody}) => {
                if(responseStatusCode === '5106' || responseStatusCode === '2002' || responseStatusCode === '2000' || responseStatusCode === '4105' || responseStatusCode === '4004') {
                    console.log(`${requestCount} ${target} - x-m2m-rsc : ${responseStatusCode} <----`);
                    console.log(responseBody);

                    requestCount++;
                    if(config.subscriptionArray.length <= requestCount) {
                        requestCount = 0;
                        resolve({state: 'create-subscription'});
                    }
                }

            }).catch (error => {
                reject(error);
            });
        }
    });
}

const createSubscription = (parent, rn, nu) => {
    return new Promise((resolve, reject) => {
        let resultsubscription = {};
        let bodyString = '';

        resultsubscription['m2m:sub'] = {};
        resultsubscription['m2m:sub'].rn = rn;
        resultsubscription['m2m:sub'].enc = {net: [3]};
        resultsubscription['m2m:sub'].nu = [nu];
        resultsubscription['m2m:sub'].nct = 2;

        bodyString = JSON.stringify(resultsubscription);

        request.post(parent, '23', bodyString).then(({responseStatusCode, responseBody}) => {
            resolve({responseStatusCode: responseStatusCode, responseBody: responseBody});
        }).catch (error => {
            reject(error);
        });
    });
}

exports.createSubscriptionAll = () => {
    return new Promise((resolve, reject) => {
        if(config.subscriptionArray.length === 0) {
            resolve({state: 'start-httpServer'});
        }
        else {
            const parent = config.subscriptionArray[requestCount].parent;
            const rn = config.subscriptionArray[requestCount].name;
            const nu = config.subscriptionArray[requestCount].nu;

            createSubscription(parent, rn, nu, requestCount).then(({responseStatusCode, responseBody}) => {
                if(responseStatusCode === '5106' || responseStatusCode === '2001' || responseStatusCode === '4105') {
                    console.log(`${requestCount} - ${parent}/${rn} - x-m2m-rsc : ${responseStatusCode} <----`);
                    console.log(JSON.stringify(responseBody));

                    requestCount++;
                    if(config.subscriptionArray.length <= requestCount) {
                        requestCount = 0;
                        resolve({state: 'start-httpServer'});
                    }
                }
            }).catch (error => {
                reject(error);
            });
        }
    });
}