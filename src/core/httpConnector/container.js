import config from 'config';
// import request from './requestHttp';
import request from './requestAxios';

// let returnCount = 0;
let requestCount = 0;

const createContainer = (parent, rn, count) => {
    return new Promise(async (resolve, reject) => {
        let bodyString = '';
        let resultContainer = {};

        resultContainer['m2m:cnt'] = {};
        resultContainer['m2m:cnt'].rn = rn;
        resultContainer['m2m:cnt'].lbl = [rn];
        bodyString = JSON.stringify(resultContainer);

        try {
            const { status, responseBody } = await request.post(parent, '3', bodyString);
            resolve({status: status, responseBody: responseBody, count: count});
        } catch (error) {
            reject(error);
        }
    });
}

exports.createContainerAll = () => {
    return new Promise(async (resolve, reject) => {
        // if(returnCount === 0) {

            if(config.containerArray.length === 0) {
                resolve({state: 'delete-subscription'});
            }
            else {
                let parent = config.containerArray[requestCount].parent;
                let rn = config.containerArray[requestCount].name;
                    try {
                        let { status, responseBody, count } = await createContainer(parent, rn, requestCount);
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