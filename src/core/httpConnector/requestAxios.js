import axios from 'axios';
import shortid from 'shortid';

import config from 'config';

axios.defaults.baseURL = `${config.useProtocol}://${config.commonServiceEntity.host}:${config.commonServiceEntity.port}`;

const request = (path, method, ...args) => {
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
            if(response.headers['x-m2m-rsc']) {
                const status = response.headers['x-m2m-rsc'];
                resolve({status: status, responseBody: response.data});
            }
        }).catch (error => {
            if(error.response) {
                const status = error.response.headers['x-m2m-rsc'];
                resolve({status: status, responseBody: error.response.data});
            } else if (error.request) {
                console.log('[http/request] : The request was made but no response was received');
            } else {
                console.log(`[http/request] : Something happened in setting up the request that triggered an Error\r\n${error.message}`);
            }
        });
    });
}

exports.get = (path) => {
    return new Promise((resolve, reject) => {
        try {
            request(path, 'get').then(({status, responseBody}) => {
                resolve({status: status, responseBody: responseBody});
            });
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
            request(path, 'post', contentType, bodyString).then(({status, responseBody}) => {
                resolve({status: status, responseBody: responseBody});
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
            request(path, 'put', contentType, bodyString).then(({status, responseBody}) => {
                resolve({status: status, responseBody: responseBody});
            });
        } catch (error) {
            reject(error)
        }
    });
}

exports.delete = (path) => {
    return new Promise((resolve, reject) => {
        try {
            request(path, 'delete').then(({status, responseBody}) => {
                resolve({status: status, responseBody: responseBody});
            });
        } catch (error) {
            reject(error)
        }
    });
=======
import axios from 'axios';
import shortid from 'shortid';

import config from 'config';

axios.defaults.baseURL = `${config.useProtocol}://${config.commonServiceEntity.host}:${config.commonServiceEntity.port}`;

const request = (path, method, ...args) => {
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
    
        if(args[0] !== undefined && args[1] !== undefined) {
            options.data = args[1];
            options.headers['Content-Type'] = args[0];
            options.headers['Content-Length'] = args[1].length;
        }
        
        axios.request(options).then((response) => {
            if(response.headers['x-m2m-rsc']) {
                const responseStatusCode = response.headers['x-m2m-rsc'];
                resolve({responseStatusCode: responseStatusCode, responseBody: response.data});
            }
        }).catch (error => {
            if(error.response) {
                const responseStatusCode = error.response.headers['x-m2m-rsc'];
                resolve({responseStatusCode: responseStatusCode, responseBody: error.response.data});
            } else if(error.request) {
                console.log('[http/request] : The request was made but no response was received');
            } else {
                console.log(`[http/request] : Something happened in setting up the request that triggered an Error\r\n${error.message}`);
            }
        });
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
        const appendTY = (ty==='') ? '': (`; ty=${ty}`);
        const contentType = `application/vnd.onem2m-res+${config.applicationEntity.bodyType}${appendTY}`;

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
>>>>>>> dev
}