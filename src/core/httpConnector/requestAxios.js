import axios from 'axios';
import shortid from 'shortid';

import config from 'config';

axios.defaults.baseURL = `${config.useProtocol}://${config.commonServiceEntity.host}:${config.commonServiceEntity.port}`;

const request = async (path, method, ...args) => {
    return new Promise((resolve, reject) => {

        let options = {
            url: path,
            method: method,
            headers: {
                'X-M2M-RI': shortid.generate(),
                'Accept': `application/${config.applicationEntity.bodyType}`,
                'X-M2M-Origin': config.applicationEntity.id,
                'Locale': 'en'
            }
        };
    
        if(args[0] != null && args[1] != null) {
            options.data = args[1];
            options.headers['Content-Type'] = args[0];
            options.headers['Content-Length'] = args[1].length;
        }
        
        axios.request(options).then((response) => {
            resolve({status: response.headers['x-m2m-rsc'], responseBody:response.data});
        }).catch ((error) => {
            const responseError = error.response;
            if(responseError.headers['x-m2m-rsc'] != null) {
                const status = responseError.headers['x-m2m-rsc'];
                resolve({status: status, responseBody:responseError.data});
            } else {
                reject(error);
            }
        });
    });
}

exports.get = (path) => {
    return new Promise((resolve, reject) => {
        try {
            resolve(request(path, 'get'));
        } catch (error) {
            reject(error)
        }
    });
}

exports.post = (path, ty, bodyString) => {
    return new Promise((resolve, reject) => {
        const appendTY = (ty==='') ? '': (`; ty=${ty}`);
        const contentType = `application/vnd.onem2m-res+${config.applicationEntity.bodyType}${appendTY}`;

        try {
            resolve(request(path, 'post', contentType, bodyString));
        } catch (error) {
            reject(error)
        }
    });
}

exports.put = (path, bodyString) => {
    return new Promise((resolve, reject) => {
        const contentType = `application/vnd.onem2m-res+${config.applicationEntity.bodyType}`;

        try {
            resolve(request(path, 'put', contentType, bodyString));
        } catch (error) {
            reject(error)
        }
    });
}

exports.delete = (path) => {
    return new Promise((resolve, reject) => {

        try {
            resolve(request(path, 'delete'));
        } catch (error) {
            reject(error)
        }
    });
}