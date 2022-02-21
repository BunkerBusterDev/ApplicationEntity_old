import http from 'axios';
import shortid from 'shortid';

import { useprotocol, cse, ae } from 'conf';
import axios from 'axios';

axios.defaults.baseURL = `${useprotocol}://${cse.host}:${cse.port}`;

const request = (path, method, ...args) => {
    return new Promise(async(resolve, reject) => {

        let options = {
            url: path,
            method: method,
            headers: {
                'X-M2M-RI': shortid.generate(),
                'Accept': `application/${ae.bodytype}`,
                'X-M2M-Origin': ae.id,
                'Locale': 'en'
            }
        };
    
        if(args[0] != null && args[1] != null) {
            options.data = args[1];
            options.headers['Content-Type'] = args[0];
            options.headers['Content-Length'] = args[1].length;
        }

        try {
            const res = await axios.request(options);
            resolve({status: res.headers['x-m2m-rsc'], res_body:res.data})
        } catch (e) {
            const res_error = e.response;
            const status = res_error.headers['x-m2m-rsc'];
            resolve({status: status, res_body:res_error.data});
        }
    });
}

exports.get = (path) => {
    return new Promise((resolve, reject) => {
        try {
            resolve(request(path, 'get'));
        } catch (e) {
            reject(e)
        }
    });
}

exports.post = (path, ty, bodyString) => {
    return new Promise((resolve, reject) => {
        const append_ty = (ty==='') ? '': (`; ty=${ty}`);
        const contentType = `application/vnd.onem2m-res+${ae.bodytype}${append_ty}`;

        try {
            resolve(request(path, 'post', contentType, bodyString));
        } catch (e) {
            reject(e)
        }
    });
}

exports.put = (path, bodyString) => {
    return new Promise((resolve, reject) => {
        const contentType = `application/vnd.onem2m-res+${ae.bodytype}`;

        try {
            resolve(request(path, 'put', contentType, bodyString));
        } catch (e) {
            reject(e)
        }
    });
}

exports.delete = (path) => {
    return new Promise((resolve, reject) => {

        try {
            resolve(request(path, 'delete'));
        } catch (e) {
            reject(e)
        }
    });
}