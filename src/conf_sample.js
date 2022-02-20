let ip = require("ip");

let conf = {};
let cse = {};
let ae = {};
let cnt_arr = [];
let sub_arr = [];

conf.useprotocol = 'http'; // 'http' or 'mqtt' 중 하나 선택

// build cse
cse.id          = '/BunkerIoT';
cse.name        = 'BunkerIoT';
cse.host        = 'xxx.xxx.xxx.xxx';
cse.port        = '7579';
cse.mqttPort    = '1883';

// build ae
ae.parent       = '/' + cse.name;
ae.name         = 'ADN-AE';
ae.id           = 'S' + ae.name;
ae.appID        = 'measure_test';
ae.port         = '9727';
ae.thingPort      = '3105';
ae.bodytype     = 'json';

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

conf.cse = cse;
conf.ae = ae;
conf.cnt = cnt_arr;
conf.sub = sub_arr;

module.exports = conf;
