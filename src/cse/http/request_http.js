import http from 'http';
import shortid from 'shortid';

import { cse, ae } from 'conf';

const request = (path, method, ...args) => {
    return new Promise(async (resolve, reject) => {
        let options = {
            hostname: cse.host,
            port: cse.port,
            path: path,
            method: method,
            headers: {
                'X-M2M-RI': shortid.generate(),
                'Accept': `application/${ae.bodytype}`,
                'X-M2M-Origin': ae.id,
                'Locale': 'en'
            }
        };
    
        if(args[1] != null) {
            options.headers['Content-Type'] = args[0];
            options.headers['Content-Length'] = args[1].length;
        }
    
        let req = http.request(options, (res) => {
            let res_body = '';

            res.on('data', function (chunk) {
                res_body += chunk;
            });
    
            res.on('end', function () {
                try {
                    let jsonObj = JSON.parse(res_body);
                    resolve({status: res.headers['x-m2m-rsc'], res_body:jsonObj});
                } catch (e) {
                    console.log('[http/request] json parse error]');
                    let jsonObj = {};
                    jsonObj.dbg = res_body;
                    resolve({status: res.headers['x-m2m-rsc'], res_body:jsonObj});
                }
            });
        });
    
        req.on('error', function (e) {
            reject(`[http/request] : problem with request: ${e.message}`);
        });
        if(args[1] != null) {
            await req.write(args[1]);
        }
        req.end();
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