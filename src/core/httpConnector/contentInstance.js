import request from './requestAxios';
// import request from './requestHttp';

exports.createContentInstance = (parent, content, socket) => {
    return new Promise((resolve, reject) => {
        let resultsContentInstance = {};
        let bodyString = '';

        resultsContentInstance['m2m:cin'] = {};
        resultsContentInstance['m2m:cin'].con = content;

        bodyString = JSON.stringify(resultsContentInstance);

        request.post(parent, '4', bodyString).then(({status}) => {
            try {
                let parentArray = parent.split('/');
                let containerName = parentArray[parentArray.length - 1];
                let result = {};
                result.containerName = containerName;
                result.content = status;
    
                console.log('<---- x-m2m-rsc : ' + status + ' <----');
                if (status == 5106 || status == 2001 || status == 4105) {
                    socket.write(JSON.stringify(result) + '<EOF>');
                    resolve(true);
                }
                else if (status == 5000) {
                    restart();
                    socket.write(JSON.stringify(result) + '<EOF>');
                    reject();
                }
                else if (status == 9999) {
                    socket.write(JSON.stringify(result) + '<EOF>');
                    reject();
                }
                else {
                    socket.write(JSON.stringify(result) + '<EOF>');
                    reject();
                }
            }
            catch (error) {
                reject(error.message);
            }
        });
    });
}