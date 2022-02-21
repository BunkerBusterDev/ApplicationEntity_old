import wdt from 'lib/wdt';
import { useprotocol } from 'conf';

import HttpApp from 'cse/http/app';

// AE core
if(useprotocol === 'mqtt') {
    console.log('./mqtt');
} else {
    const httpApp = new HttpApp();
    wdt.set_wdt('http/app/initialize', 1, httpApp.initialize);
}