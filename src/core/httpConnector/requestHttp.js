import http from 'http';
import shortid from 'shortid';

import config from 'config';

const request = (path, method, ...args) => {
    return new Promise((resolve, reject) => {
        let options = {
            hostname: config.commonServiceEntity.host,
            port: config.commonServiceEntity.port,
            path: path,
            method: method,
            headers: {
                'X-M2M-RI': shortid.generate(),
                'Accept': `application/${config.applicationEntity.bodyType}`,
                'X-M2M-Origin': config.applicationEntity.id,
                'Locale': 'en'
            }
        };
    
        if(args[1] !== undefined) {
            options.headers['Content-Type'] = args[0];
            options.headers['Content-Length'] = args[1].length;
        }
    
        let request = http.request(options, (response) => {
            let responseBody = '';

            response.on('data', function (chunk) {
                responseBody += chunk;
            });
    
            response.on('end', function () {
                try {
                    let responseBodyToJson = JSON.parse(responseBody);
                    resolve({responseStatusCode: response.headers['x-m2m-rsc'], responseBody:responseBodyToJson});
                } catch (error) {
                    console.log('[http/request] json parse error]');
                    let responseBodyToJson = {};
                    responseBodyToJson.dbg = responseBody;
                    resolve({responseStatusCode: response.headers['x-m2m-rsc'], responseBody:responseBodyToJson});
                }
            });
        });
    
        request.on('error', function (error) {
            reject(`[http/request] : problem with request: ${error.message}`);
        });

        if(args[1] !== undefined) {
            request.write(args[1])
        }

        request.end();
    });
}

exports.get = (path) => {
    return new Promise((resolve, reject) => {
        try {
            request(path, 'get').then(({responseStatusCode, responseBody}) => {
                resolve({responseStatusCode: responseStatusCode, responseBody: responseBody});
            });
        } catch (error) {
            reject(error)
        }
    });
}

exports.post = (path, ty, bodyString) => {
    return new Promise((resolve, reject) => {
        const appendTy = (ty==='') ? '': (`; ty=${ty}`);
        const contentType = `application/vnd.onem2m-res+${config.applicationEntity.bodyType}${appendTy}`;

        try {
            request(path, 'post', contentType, bodyString).then(({responseStatusCode, responseBody}) => {
                resolve({responseStatusCode: responseStatusCode, responseBody: responseBody});
            });
        } catch (error) {
            reject(error);
        }
    });
}

exports.put = (path, bodyString) => {
    return new Promise((resolve, reject) => {
        const contentType = `application/vnd.onem2m-res+${config.applicationEntity.bodyType}`;

        try {
            request(path, 'put', contentType, bodyString).then(({responseStatusCode, responseBody}) => {
                resolve({responseStatusCode: responseStatusCode, responseBody: responseBody});
            });
        } catch (error) {
            reject(error)
        }
    });
}

exports.delete = (path) => {
    return new Promise((resolve, reject) => {
        try {
            request(path, 'delete').then(({responseStatusCode, responseBody}) => {
                resolve({responseStatusCode: responseStatusCode, responseBody: responseBody});
            });
        } catch (error) {
            reject(error)
        }
    });
}