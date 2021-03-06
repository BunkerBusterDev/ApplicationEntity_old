let count = 0;
let config = {};
let commonServiceEntity = {};
let applicationEntity = {};
let containerArray = [];
let subscriptionArray = [];

config.useProtocol = 'http'; // 'http' or 'mqtt' 중 하나 선택

// build commonServiceEntity
commonServiceEntity.id          = '/BunkerIoT';
commonServiceEntity.name        = 'BunkerIoT';
commonServiceEntity.host        = 'localhost';
commonServiceEntity.port        = '7579';
commonServiceEntity.mqttPort    = '1883';

// build applicationEntity
applicationEntity.parent       = `/${commonServiceEntity.name}`;
applicationEntity.name         = 'ApplicationEntity';
applicationEntity.id           = 'S' + applicationEntity.name;
applicationEntity.appID        = 'ApplicationEntityTest';
applicationEntity.port         = '9727';
applicationEntity.thingPort      = '3105';
applicationEntity.bodyType     = 'json';

 // build container
 count = 1;
 for(let i=0; i<count; i++){
    containerArray[i] = {};
    containerArray[i].parent = `/${commonServiceEntity.name}/${applicationEntity.name}`;
    containerArray[i].name = `container_illum_${i+1}`;
 }

 count = containerArray.length;
 containerArray[count] = {};
 containerArray[count].parent = `/${commonServiceEntity.name}/${applicationEntity.name}`;
 containerArray[count].name = `container_led_1`;
 
 // build subscription
 count = 1;
 for(let i=0; i<count; i++){    
    subscriptionArray[i] = {};
    subscriptionArray[i].parent = `/${commonServiceEntity.name}/${applicationEntity.name}/${containerArray[containerArray.length-1].name}`;
    subscriptionArray[i].name = 'sub';
    if(config.useProtocol === 'http') {
       subscriptionArray[i].nu = `http://${commonServiceEntity.host}:${applicationEntity.port}/noti?ct=json`; // http
    } else if(config.useProtocol === 'mqtt') {
       subscriptionArray[i].nu = `mqtt://${commonServiceEntity.host}/${applicationEntity.id}?ct=${applicationEntity.bodyType}`; // mqtt
       //subscriptionArray[i].nu = `mqtt://${commonServiceEntity.host}/${applicationEntity.id}?rcn=9&ct=${applicationEntity.bodyType}`; // mqtt
    }
 }

config.commonServiceEntity = commonServiceEntity;
config.applicationEntity = applicationEntity;
config.containerArray = containerArray;
config.subscriptionArray = subscriptionArray;

module.exports = config;
