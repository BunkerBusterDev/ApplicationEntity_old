import shortid from 'shortid';

import config from 'config';
import request from './requestAxios';
// import request from './requestHttp';

exports.createApplicationEntity =  () => {
    return new Promise((resolve, reject) => {
        let bodyString = '';
        let resultsApplicationEntity = {};
    
        resultsApplicationEntity['m2m:ae'] = {};
        resultsApplicationEntity['m2m:ae'].api = config.applicationEntity.appID;
        resultsApplicationEntity['m2m:ae'].rn = config.applicationEntity.name;
        resultsApplicationEntity['m2m:ae'].rr = true;
    
        bodyString = JSON.stringify(resultsApplicationEntity);

        request.post(config.applicationEntity.parent, '2', bodyString).then(({responseStatusCode, responseBody}) => {
            if(responseStatusCode === '2001') {
                config.applicationEntity.id = responseBody['m2m:ae']['aei'];

                console.log(`x-m2m-rsc : ${responseStatusCode} - ${config.applicationEntity.id} <----`);
                resolve({state: 'create-container'});
            }
            else if(responseStatusCode === '5106' || responseStatusCode === '4105') {
                console.log(`x-m2m-rsc : ${responseStatusCode} <----`);
                resolve({state: 'retrieve-applicationEntity'});
            }
        }).catch (error => {
            reject(error);
        });
    });
}

exports.retrieveApplicationEntity = () => {
    return new Promise((resolve, reject) => {

        if(config.applicationEntity.id === 'S') {
            config.applicationEntity.id = 'S' + shortid.generate();
        }
        request.get(`${config.applicationEntity.parent}/${config.applicationEntity.name}`).then(({responseStatusCode, responseBody}) => {
            if(responseStatusCode === '2000') {
                let applicationEntityId = responseBody['m2m:ae']['aei'];
                console.log(`x-m2m-rsc : ${responseStatusCode} - ${applicationEntityId} <----`);

                if(config.applicationEntity.id != applicationEntityId && config.applicationEntity.id != ('/'+applicationEntityId)) {
                    reject(`Application-Entity-ID created is ${applicationEntityId} not equal to device Application-Entity-ID is ${config.applicationEntity.id}`);
                }
                else {
                    resolve({state: 'create-container'});
                }
            }
            else {
                reject(`x-m2m-rsc : ${responseStatusCode} <----`);
            }
        }).catch (error => {
            reject(error);
        });
    });
}