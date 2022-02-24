import config from 'config';
// import request from './requestHttp';
import request from './requestAxios';

// let returnCount = 0;
let requestCount = 0;

const createContainer = (parent, rn, count) => {
    return new Promise((resolve, reject) => {
        let bodyString = '';
        let resultContainer = {};

        resultContainer['m2m:cnt'] = {};
        resultContainer['m2m:cnt'].rn = rn;
        resultContainer['m2m:cnt'].lbl = [rn];
        bodyString = JSON.stringify(resultContainer);

        request.post(parent, '3', bodyString).then((status, responseBody) => {
            resolve({status: status, responseBody: responseBody, count: count});
        }).catch ((error) => {
            reject(error);
        });
    });
}

exports.createContainerAll = () => {
    return new Promise((resolve, reject) => {
        // if(returnCount === 0) {

            if(config.containerArray.length === 0) {
                resolve({state: 'delete-subscription'});
            }
            else {
                let parent = config.containerArray[requestCount].parent;
                let rn = config.containerArray[requestCount].name;
                createContainer(parent, rn, requestCount).then((status, responseBody, count) => {
                    if (status === '2001' || status === '5106' || status === '4105') {
                        console.log(`${count} ${parent}/ ${rn} - x-m2m-rsc : ${status} <----`);
                        console.log(responseBody);

                        requestCount = ++count;
                        // returnCount = 0;
                        if (config.containerArray.length <= count) {
                            requestCount = 0;
                            // return_count = 0;
                            resolve({state: 'delete-subscription'});
                        }
                    }
                }).catch ((error) => {
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