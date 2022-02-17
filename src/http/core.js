
import wdt from 'lib/wdt';
import HttpAe from './ae';

let initState = 'create_ae';

const initDevice = async () => {
    if (initState === 'create_ae') {
        console.log('[initState] : ' + initState);
        
        try {
            const { state } = await HttpAe.createAE();
            initState = state;
        } catch (e) {
            console.log(e);
        }
    } else if(initState === 'retrieve_ae') {
        console.log('[initState] : ' + initState);
        initState = 'create_cnt';
    } else if(initState === 'create_cnt') {
        console.log('[initState] : ' + initState);
        initState = 'delete_sub';
    } else if(initState === 'delete_sub') {
        console.log('[initState] : ' + initState);
        initState = 'create_sub';
    } else if(initState === 'create_sub') {
        console.log('[initState] : ' + initState);
        initState = 'ready';
    } else if('ready') {
        wdt.del_wdt('initDevice');
    }
}

exports.start = () => {
    wdt.set_wdt('initDevice', 2, initDevice);
}