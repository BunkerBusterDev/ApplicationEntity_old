import { sub } from 'conf';
// import request from './request_http';
import request from './request_axios';

// let return_count = 0;
let request_count = 0;

const deleteSub = (target, count) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { status, res_body } = await request.delete(target);
            resolve({status: status, res_body: res_body, count: count});
        } catch (e) {
            reject(e);
        }
    });
}

exports.deleteSubAll = () => {
    return new Promise(async (resolve, reject) => {
        // if(return_count === 0) {
            let state = '';

            if(sub.length === 0) {
                state = 'create_sub'
                resolve({state: state});
            }
            else {
                const target = `${sub[request_count].parent}/${sub[request_count].name}`;
                    try {
                        let { status, res_body, count } = await deleteSub(target, request_count);
                        if (status === '5106' || status === '2002' || status === '2000' || status === '4105' || status === '4004') {
                            console.log(`${count} ${target} - x-m2m-rsc : ${status} <----`);
                            console.log(res_body);

                            request_count = ++count;
                            // return_count = 0;
                            if (sub.length <= count) {
                                request_count = 0;
                                // return_count = 0;
                                state = 'create_sub';
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

const createSub = (parent, rn, nu, count) => {
    return new Promise(async (resolve, reject) => {
        let results_ss = {};
        let bodyString = '';

        results_ss['m2m:sub'] = {};
        results_ss['m2m:sub'].rn = rn;
        results_ss['m2m:sub'].enc = {net: [3]};
        results_ss['m2m:sub'].nu = [nu];
        results_ss['m2m:sub'].nct = 2;

        bodyString = JSON.stringify(results_ss);

        try {
            const { status, res_body } = await request.post(parent, '23', bodyString);
            resolve({status: status, res_body: res_body, count: count});
        } catch (e) {
            reject(e);
        }
    });
}

exports.createSubAll = () => {
    return new Promise(async (resolve, reject) => {
        // if(return_count === 0) {
            let state = '';

            if(sub.length === 0) {
                state = 'start_httpserver'
                resolve({state: state});
            }
            else {
                const parent = sub[request_count].parent;
                const rn = sub[request_count].name;
                const nu = sub[request_count].nu;

                    try {
                        let { status, res_body, count } = await createSub(parent, rn, nu, request_count);
                        if (status === '5106' || status === '2001' || status === '4105') {
                            console.log(`${count} - ${parent}/${rn} - x-m2m-rsc : ${status} <----`);
                            console.log(JSON.stringify(res_body));

                            request_count = ++count;
                            // return_count = 0;
                            if (sub.length <= count) {
                                request_count = 0;
                                // return_count = 0;
                                state = 'start_httpserver';
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