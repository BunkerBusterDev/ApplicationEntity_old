import shortid from 'shortid';
import http from 'http';

import { cse, ae } from 'conf';

exports.httpRequest = (path, method, ty, bodyString) => {
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
    
        if(bodyString.length > 0) {
            options.headers['Content-Length'] = bodyString.length;
        }
    
        if(method === 'post') {
            let append_ty = (ty==='') ? '': (`; ty=${ty}`);
            options.headers['Content-Type'] = `application/vnd.onem2m-res+${ae.bodytype}${append_ty}`;
        }
        else if(method === 'put') {
            options.headers['Content-Type'] = `application/vnd.onem2m-res+${ae.bodytype}`;
        }
    
        let req = http.request(options, (res) => {
            let res_body = '';

            res.on('data', function (chunk) {
                res_body += chunk;
            });
    
            res.on('end', function () {
                try {
                    let jsonObj = JSON.parse(res_body);
                    resolve({res: res, res_body:jsonObj});
                } catch (e) {
                    console.log('[http/httpRequest] json parse error]');
                    let jsonObj = {};
                    jsonObj.dbg = res_body;
                    resolve({res: res, res_body:jsonObj});
                }
            });
        });
    
        req.on('error', function (e) {
            reject(`[httpRequest] : problem with request: ${e.message}`);
        });
    
        await req.write(bodyString);
        req.end();
    });
}