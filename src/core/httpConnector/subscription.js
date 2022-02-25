import config from 'config';
import request from './requestAxios';
// import request from './requestHttp';

// let returnCount = 0;
let requestCount = 0;

const deleteSubscription = (target) => {
    return new Promise((resolve, reject) => {
        request.delete(target).then(({rsponseStatusCode, responseBody}) => {
            resolve({rsponseStatusCode: rsponseStatusCode, responseBody: responseBody});
        }).catch (error => {
            reject(error);
        });
    });
}

exports.deleteSubscriptionAll = () => {
    return new Promise((resolve, reject) => {
        // if(returnCount === 0) {
            if(config.subscriptionArray.length === 0) {
                resolve({state: 'create-subscription'});
            }
            else {
                const target = `${config.subscriptionArray[requestCount].parent}/${config.subscriptionArray[requestCount].name}`;
                deleteSubscription(target).then(({rsponseStatusCode, responseBody}) => {
                    if (rsponseStatusCode === '5106' || rsponseStatusCode === '2002' || rsponseStatusCode === '2000' || rsponseStatusCode === '4105' || rsponseStatusCode === '4004') {
                        console.log(`${requestCount} ${target} - x-m2m-rsc : ${rsponseStatusCode} <----`);
                        console.log(responseBody);

                        requestCount++;
                        // returnCount = 0;
                        if (config.subscriptionArray.length <= requestCount) {
                            requestCount = 0;
                            // returnCount = 0;
                            resolve({state: 'create-subscription'});
                        }
                    }

                }).catch (error => {
                    reject(error);
                });
            }
        // }
        // returnCount++;
        // if(returnCount >= 3) {
        //     returnCount = 0;
        // }
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

        request.post(parent, '23', bodyString).then(({rsponseStatusCode, responseBody}) => {
            resolve({rsponseStatusCode: rsponseStatusCode, responseBody: responseBody});
        }).catch (error => {
            reject(error);
        });
    });
}

exports.createSubscriptionAll = () => {
    return new Promise((resolve, reject) => {
        // if(returnCount === 0) {
            if(config.subscriptionArray.length === 0) {
                resolve({state: 'start-httpServer'});
            }
            else {
                const parent = config.subscriptionArray[requestCount].parent;
                const rn = config.subscriptionArray[requestCount].name;
                const nu = config.subscriptionArray[requestCount].nu;

                createSubscription(parent, rn, nu, requestCount).then(({rsponseStatusCode, responseBody}) => {
                    if (rsponseStatusCode === '5106' || rsponseStatusCode === '2001' || rsponseStatusCode === '4105') {
                        console.log(`${requestCount} - ${parent}/${rn} - x-m2m-rsc : ${rsponseStatusCode} <----`);
                        console.log(JSON.stringify(responseBody));

                        requestCount++;
                        // returnCount = 0;
                        if (config.subscriptionArray.length <= requestCount) {
                            requestCount = 0;
                            // returnCount = 0;
                            resolve({state: 'start-httpServer'});
                        }
                    }
                }).catch (error => {
                    reject(error);
                });
            }
        // }
        // returnCount++;
        // if(returnCount >= 3) {
        //     returnCount = 0;
        // }
    });
}