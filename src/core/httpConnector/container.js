import config from 'config';
import request from './requestAxios';
// import request from './requestHttp';

// let returnCount = 0;
let requestCount = 0;

const createContainer = (parent, rn) => {
    return new Promise((resolve, reject) => {
        let bodyString = '';
        let resultContainer = {};

        resultContainer['m2m:cnt'] = {};
        resultContainer['m2m:cnt'].rn = rn;
        resultContainer['m2m:cnt'].lbl = [rn];
        bodyString = JSON.stringify(resultContainer);

        request.post(parent, '3', bodyString).then(({rsponseStatusCode, responseBody}) => {
            resolve({rsponseStatusCode: rsponseStatusCode, responseBody: responseBody});
        }).catch (error => {
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
                createContainer(parent, rn).then(({rsponseStatusCode, responseBody}) => {
                    if (rsponseStatusCode === '2001' || rsponseStatusCode === '5106' || rsponseStatusCode === '4105') {
                        console.log(`${requestCount} ${parent}/ ${rn} - x-m2m-rsc : ${rsponseStatusCode} <----`);
                        console.log(responseBody);

                        requestCount++;
                        // returnCount = 0;
                        if (config.containerArray.length <= requestCount) {
                            requestCount = 0;
                            // return_count = 0;
                            resolve({state: 'delete-subscription'});
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