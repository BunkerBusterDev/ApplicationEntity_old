import { ae } from 'conf';
import { httpRequest } from './request';

exports.createAE = () => {
    return new Promise(async (resolve, reject) => {
        let state = '';
        let bodyString = '';
        let results_ae = {};
    
        results_ae['m2m:ae'] = {};
        results_ae['m2m:ae'].api = ae.appid;
        results_ae['m2m:ae'].rn = ae.name;
        results_ae['m2m:ae'].rr = true;
    
        bodyString = JSON.stringify(results_ae);

        try {
            const { res, res_body } = await httpRequest(ae.parent, 'post', '2', bodyString);
            const status = res.headers['x-m2m-rsc'];        
            if (status == 2001) {
                ae_response_action(status, res_body, function (status, aeid) {
                    console.log(`x-m2m-rsc : ${status} - ${aeid} <----`);
                    state = 'create_cnt';
                    request_count = 0;
                    return_count = 0;
                });
            }
            else if (status == 5106 || status == 4105) {
                console.log(`x-m2m-rsc : ${status} <----`);
                state = 'retrieve_ae'
            }
            resolve({state: state});

        } catch (e) {
            reject(e);
        }
    });
}