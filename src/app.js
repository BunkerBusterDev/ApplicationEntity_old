import { useprotocol } from 'conf';
import httpCore from 'http/core';

// AE core
if(useprotocol === 'mqtt') {
    console.log('./mqtt');
} else {
    httpCore.start();
}