import request from './requestAxios';
// import request from './requestHttp';
import httpConnector from 'core/httpConnector';

exports.createContentInstance = (parent, content, socket) => {
    return new Promise((resolve, reject) => {
        let resultsContentInstance = {};
        let bodyString = '';

        resultsContentInstance['m2m:cin'] = {};
        resultsContentInstance['m2m:cin'].con = content;

        bodyString = JSON.stringify(resultsContentInstance);

        request.post(parent, '4', bodyString).then(({responseStatusCode}) => {
            let parentArray = parent.split('/');
            let containerName = parentArray[parentArray.length-1];
            let result = {};
            result.containerName = containerName;
            result.content = responseStatusCode;

            console.log(`<---- x-m2m-rsc : ${responseStatusCode} <----`);
            if(responseStatusCode === '5106' || responseStatusCode === '2001' || responseStatusCode == '4105') {
                socket.write(JSON.stringify(result) + '<EOF>');
                resolve();
            }
            else if(responseStatusCode === '5000') {
                httpConnector.restart();
                socket.write(JSON.stringify(result) + '<EOF>');
                reject();
            }
            else if(responseStatusCode === '9999') {
                socket.write(JSON.stringify(result) + '<EOF>');
                reject();
            }
            else {
                socket.write(JSON.stringify(result) + '<EOF>');
                reject();
            }
        });
    });
}