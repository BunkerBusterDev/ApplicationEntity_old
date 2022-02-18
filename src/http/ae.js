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
            if (status === '2001') {
                ae.id = res_body['m2m:ae']['aei'];

                console.log(`x-m2m-rsc : ${status} - ${ae.id} <----`);
                state = 'create_cnt';
                resolve({state: state});
            }
            else if (status === '5106' || status === '4105') {
                console.log(`x-m2m-rsc : ${status} <----`);
                state = 'retrieve_ae'
                resolve({state: state});
            }

        } catch (e) {
            reject(e);
        }
    });
}

exports.retrieveAE = () => {
    return new Promise(async (resolve, reject) => {
        let state = '';

        if (ae.id === 'S') {
            ae.id = 'S' + shortid.generate();
        }
        
        try {
            const { res, res_body } = await httpRequest(`${ae.parent}/${ae.name}`, 'get', '', '');
            const status = res.headers['x-m2m-rsc'];  

            if (status === '2000') {
                let aeid = res_body['m2m:ae']['aei'];
                console.log(`x-m2m-rsc : ${status} - ${aeid} <----`);

                if(ae.id != aeid && ae.id != ('/'+aeid)) {
                    rejeact(`AE-ID created is ${aeid} not equal to device AE-ID is ${conf.ae.id}`);
                }
                else {
                    state = 'create_cnt';
                    resolve({state: state});
                }
            }
            else {
                reject(`x-m2m-rsc : ${status} <----`);
            }

        } catch (e) {
            reject(e);
        }
    });
}