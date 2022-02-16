import conf from './conf';
import HttpCore from './http/http_core';

// AE core
if(conf.useprotocol === 'mqtt') {
    console.log('./mqtt');
} else {
    new HttpCore();
}