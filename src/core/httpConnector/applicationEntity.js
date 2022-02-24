import shortid from 'shortid';

import config from 'config';
import request from './requestHttp';
// import request from './requestAxios';

exports.createApplicationEntity =  () => {
    return new Promise((resolve, reject) => {
        let bodyString = '';
        let resultsApplicationEntity = {};
    
        resultsApplicationEntity['m2m:ae'] = {};
        resultsApplicationEntity['m2m:ae'].api = config.applicationEntity.appID;
        resultsApplicationEntity['m2m:ae'].rn = config.applicationEntity.name;
        resultsApplicationEntity['m2m:ae'].rr = true;
    
        bodyString = JSON.stringify(resultsApplicationEntity);

            request.post(config.applicationEntity.parent, '2', bodyString).then((status, responseBody) => {
                console.log(status);
                if (status === '2001') {
                    config.applicationEntity.id = responseBody['m2m:ae']['aei'];
    
                    console.log(`x-m2m-rsc : ${status} - ${config.applicationEntity.id} <----`);
                    resolve({state: 'create-container'});
                }
                else if (status === '5106' || status === '4105') {
                    console.log(`x-m2m-rsc : ${status} <----`);
                    resolve({state: 'retrieve-applicationEntity'});
                }
            }).catch ((error) => {
                reject(error);
            });
    });
}

exports.retrieveApplicationEntity = () => {
    return new Promise((resolve, reject) => {

        if (config.applicationEntity.id === 'S') {
            config.applicationEntity.id = 'S' + shortid.generate();
        }
        request.get(`${config.applicationEntity.parent}/${config.applicationEntity.name}`).then((status, responseBody) => {
            if (status === '2000') {
                let applicationEntityId = responseBody['m2m:ae']['aei'];
                console.log(`x-m2m-rsc : ${status} - ${applicationEntityId} <----`);

                if(config.applicationEntity.id != applicationEntityId && config.applicationEntity.id != ('/'+applicationEntityId)) {
                    reject(`Application-Entity-ID created is ${applicationEntityId} not equal to device Application-Entity-ID is ${config.applicationEntity.id}`);
                }
                else {
                    resolve({state: 'create-container'});
                }
            }
            else {
                reject(`x-m2m-rsc : ${status} <----`);
            }
        }).catch ((error) => {
            reject(error);
        });
    });
}