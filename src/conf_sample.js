 let ip = require("ip");

 let conf = {};
 let cse = {};
 let ae = {};
 let cnt_arr = [];
 let sub_arr = [];
 let acp = {};
 
 conf.useprotocol = 'http'; // 'http' or 'mqtt' or 'coap' or 'ws' 중 하나 선택
 
 // build cse
 cse.id          = '/BunkerIoT';
 cse.name        = 'BunkerIoT';
 cse.host        = 'xxx.xxx.xxx.xxx';
 cse.port        = '7579';
 cse.mqttport    = '1883';
 cse.wsport      = '7577';
 
 // build ae
 ae.parent       = '/' + cse.name;
 ae.id           = 'S' + ae.name;
 ae.name         = 'BunkerAE';
 ae.appid        = 'measure_test';
 ae.port         = '9727';
 ae.tasport      = '3105';
 ae.bodytype     = 'json'; // 'json' or 'xml' or 'cbor' 중 하나 선택
 
 // build cnt
 let count = 0;
 cnt_arr[count] = {};
 cnt_arr[count].parent = '/' + cse.name + '/' + ae.name;
 cnt_arr[count++].name = 'cnt_illum';
 cnt_arr[count] = {};
 cnt_arr[count].parent = '/' + cse.name + '/' + ae.name;
 cnt_arr[count++].name = 'cnt_rgb';
 cnt_arr[count] = {};
 cnt_arr[count].parent = '/' + cse.name + '/' + ae.name;
 cnt_arr[count++].name = 'cnt_led';
 
 // build sub
 count = 0;
 sub_arr[count] = {};
 sub_arr[count].parent = '/' + cse.name + '/' + ae.name + '/' + cnt_arr[2].name;
 sub_arr[count].name = 'sub';
 sub_arr[count++].nu = 'http://' + ip.address() + ':' + ae.port + '/noti?ct=json'; // http
 //sub_arr[count++].nu = 'Mobius/'+ae.name; // mqtt
 //sub_arr[count++].nu = 'mqtt://' + cse.host + '/' + ae.id + '?ct=json'; // mqtt
 //sub_arr[count++].nu = 'mqtt://' + cse.host + '/' + ae.id + '?ct=' + ae.bodytype; // mqtt
 //sub_arr[count++].nu = 'mqtt://' + cse.host + '/' + ae.id + '?rcn=9&ct=' + ae.bodytype; // mqtt

 // build acp: not complete
 // acp.parent = '/' + cse.name + '/' + ae.name;
 // acp.name = 'acp-' + ae.name;
 // acp.id = ae.id;

 conf.usesecure  = 'disable'; // 'enable' or 'disable' 중 하나 선택
 
 if(conf.usesecure === 'enable') {
     cse.mqttport = '8883';
 }
 
 conf.cse = cse;
 conf.ae = ae;
 conf.cnt = cnt_arr;
 conf.sub = sub_arr;
 conf.acp = acp;
 
 module.exports = conf;
 