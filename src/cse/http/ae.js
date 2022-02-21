import { ae } from 'conf';
import request from './request_http';
// import request from './request_axios';

exports.createAE = () => {
    return new Promise(async (resolve, reject) => {
        let bodyString = '';
        let results_ae = {};
    
        results_ae['m2m:ae'] = {};
        results_ae['m2m:ae'].api = ae.appID;
        results_ae['m2m:ae'].rn = ae.name;
        results_ae['m2m:ae'].rr = true;
    
        bodyString = JSON.stringify(results_ae);
        try {
            const { status, res_body } = await request.post(ae.parent, '2', bodyString);
            if (status === '2001') {
                ae.id = res_body['m2m:ae']['aei'];

                console.log(`x-m2m-rsc : ${status} - ${ae.id} <----`);
                resolve({state: 'create_cnt'});
            }
            else if (status === '5106' || status === '4105') {
                console.log(`x-m2m-rsc : ${status} <----`);
                resolve({state: 'retrieve_ae'});
            }

        } catch (e) {
            reject(e);
        }
    });
}

exports.retrieveAE = () => {
    return new Promise(async (resolve, reject) => {

        if (ae.id === 'S') {
            ae.id = 'S' + shortid.generate();
        }
        
        try {
            const { status, res_body } = await request.get(`${ae.parent}/${ae.name}`);

            if (status === '2000') {
                let aeid = res_body['m2m:ae']['aei'];
                console.log(`x-m2m-rsc : ${status} - ${aeid} <----`);

                if(ae.id != aeid && ae.id != ('/'+aeid)) {
                    rejeact(`AE-ID created is ${aeid} not equal to device AE-ID is ${conf.ae.id}`);
                }
                else {
                    resolve({state: 'create_cnt'});
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