import { cnt } from 'conf';
// import request from './request_http';
import request from './request_axios';

// let return_count = 0;
let request_count = 0;

const createCnt = (parent, rn, count) => {
    return new Promise(async (resolve, reject) => {
        let bodyString = '';
        let results_ct = {};

        results_ct['m2m:cnt'] = {};
        results_ct['m2m:cnt'].rn = rn;
        results_ct['m2m:cnt'].lbl = [rn];
        bodyString = JSON.stringify(results_ct);

        try {
            const { status, res_body } = await request.post(parent, '3', bodyString);
            resolve({status: status, res_body: res_body, count: count});
        } catch (e) {
            reject(e);
        }
    });
}

exports.createCntAll = () => {
    return new Promise(async (resolve, reject) => {
        // if(return_count === 0) {
            let state = '';

            if(cnt.length === 0) {
                state = 'delete_sub'
                resolve({state: state});
            }
            else {
                let parent = cnt[request_count].parent;
                let rn = cnt[request_count].name;
                    try {
                        let { status, res_body, count } = await createCnt(parent, rn, request_count);
                        if (status === '2001' || status === '5106' || status === '4105') {
                            console.log(`${count} ${parent}/ ${rn} - x-m2m-rsc : ${status} <----`);
                            console.log(res_body);

                            request_count = ++count;
                            // return_count = 0;
                            if (cnt.length <= count) {
                                request_count = 0;
                                // return_count = 0;
                                state = 'delete_sub';
                                resolve({state: state});
                            }
                        }
                    } catch (e) {
                        reject(e);
                    }
                
            }
        // }
        // return_count++;
        // if(return_count >= 3) {
        //     return_count = 0;
        // }
    });
}