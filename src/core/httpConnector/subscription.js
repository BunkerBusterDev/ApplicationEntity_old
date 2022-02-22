import config from 'config';
// import request from './requestHttp';
import request from './requestAxios';

// let returnCount = 0;
let requestCount = 0;

const deleteSubscription = (target, count) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { status, responseBody } = await request.delete(target);
            resolve({status: status, responseBody: responseBody, count: count});
        } catch (error) {
            reject(error);
        }
    });
}

exports.deleteSubscriptionAll = () => {
    return new Promise(async (resolve, reject) => {
        // if(returnCount === 0) {
            if(config.subscriptionArray.length === 0) {
                resolve({state: 'create-subscription'});
            }
            else {
                const target = `${config.subscriptionArray[requestCount].parent}/${config.subscriptionArray[requestCount].name}`;
                    try {
                        let { status, responseBody, count } = await deleteSubscription(target, requestCount);
                        if (status === '5106' || status === '2002' || status === '2000' || status === '4105' || status === '4004') {
                            console.log(`${count} ${target} - x-m2m-rsc : ${status} <----`);
                            console.log(responseBody);

                            requestCount = ++count;
                            // returnCount = 0;
                            if (config.subscriptionArray.length <= count) {
                                requestCount = 0;
                                // returnCount = 0;
                                resolve({state: 'create-subscription'});
                            }
                        }
                    } catch (error) {
                        reject(error);
                    }
                
            }
        // }
        // returnCount++;
        // if(returnCount >= 3) {
        //     returnCount = 0;
        // }
    });
}

const createSubscription = (parent, rn, nu, count) => {
    return new Promise(async (resolve, reject) => {
        let resultsubscription = {};
        let bodyString = '';

        resultsubscription['m2m:sub'] = {};
        resultsubscription['m2m:sub'].rn = rn;
        resultsubscription['m2m:sub'].enc = {net: [3]};
        resultsubscription['m2m:sub'].nu = [nu];
        resultsubscription['m2m:sub'].nct = 2;

        bodyString = JSON.stringify(resultsubscription);

        try {
            const { status, responseBody } = await request.post(parent, '23', bodyString);
            resolve({status: status, responseBody: responseBody, count: count});
        } catch (error) {
            reject(error);
        }
    });
}

exports.createSubscriptionAll = () => {
    return new Promise(async (resolve, reject) => {
        // if(returnCount === 0) {
            if(config.subscriptionArray.length === 0) {
                resolve({state: 'start-httpServer'});
            }
            else {
                const parent = config.subscriptionArray[requestCount].parent;
                const rn = config.subscriptionArray[requestCount].name;
                const nu = config.subscriptionArray[requestCount].nu;

                    try {
                        let { status, responseBody, count } = await createSubscription(parent, rn, nu, requestCount);
                        if (status === '5106' || status === '2001' || status === '4105') {
                            console.log(`${count} - ${parent}/${rn} - x-m2m-rsc : ${status} <----`);
                            console.log(JSON.stringify(responseBody));

                            requestCount = ++count;
                            // returnCount = 0;
                            if (config.subscriptionArray.length <= count) {
                                requestCount = 0;
                                // returnCount = 0;
                                resolve({state: 'start-httpServer'});
                            }
                        }
                    } catch (error) {
                        reject(error);
                    }
                
            }
        // }
        // returnCount++;
        // if(returnCount >= 3) {
        //     returnCount = 0;
        // }
    });
}