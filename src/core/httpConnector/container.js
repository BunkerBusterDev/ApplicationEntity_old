import config from 'config';
import request from './requestAxios';
// import request from './requestHttp';

let requestCount = 0;

const createContainer = (parent, rn) => {
    return new Promise((resolve, reject) => {
        let bodyString = '';
        let resultContainer = {};

        resultContainer['m2m:cnt'] = {};
        resultContainer['m2m:cnt'].rn = rn;
        resultContainer['m2m:cnt'].lbl = [rn];
        bodyString = JSON.stringify(resultContainer);

        request.post(parent, '3', bodyString).then(({responseStatusCode, responseBody}) => {
            resolve({responseStatusCode: responseStatusCode, responseBody: responseBody});
        }).catch (error => {
            reject(error);
        });
    });
}

exports.createContainerAll = () => {
    return new Promise((resolve, reject) => {
        if(config.containerArray.length === 0) {
            resolve({state: 'delete-subscription'});
        }
        else {
            const parent = config.containerArray[requestCount].parent;
            const rn = config.containerArray[requestCount].name;
            createContainer(parent, rn).then(({responseStatusCode, responseBody}) => {
                if(responseStatusCode === '2001' || responseStatusCode === '5106' || responseStatusCode === '4105') {
                    console.log(`${requestCount} ${parent}/ ${rn} - x-m2m-rsc : ${responseStatusCode} <----`);
                    console.log(responseBody);

                    requestCount++;
                    if(config.containerArray.length <= requestCount) {
                        requestCount = 0;
                        resolve({state: 'delete-subscription'});
                    }
                }
            }).catch (error => {
                reject(error);
            });
        }
    });
}