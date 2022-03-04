exports.parseSgn = (primitiveContent) => {
    let pathArray = '';
    let sgnObj = {};
    let contentInstanceObject = {};

    if(primitiveContent.sgn) {
        const nmtype = primitiveContent['sgn'] !== undefined ? 'short' : 'long';
        sgnObj = primitiveContent['sgn'] !== undefined ? primitiveContent['sgn'] : primitiveContent['singleNotification'];

        if(nmtype === 'long') {
            console.log('oneM2M spec. define only short name forresource')
        }
        else { // 'short'
            if(sgnObj.sur) {
                if(sgnObj.sur.charAt(0) !== '/') {
                    sgnObj.sur = '/' + sgnObj.sur;
                }
                pathArray = sgnObj.sur.split('/');
            }

            if(sgnObj.nev) {
                if(sgnObj.nev.rep) {
                    if(sgnObj.nev.rep['m2m:cin']) {
                        sgnObj.nev.rep.cin = sgnObj.nev.rep['m2m:cin'];
                        delete sgnObj.nev.rep['m2m:cin'];
                    }

                    if(sgnObj.nev.rep.cin) {
                        contentInstanceObject = sgnObj.nev.rep.cin;
                    }
                    else {
                        console.log('[mqtt_noti_action] m2m:cin is none');
                        contentInstanceObject = null;
                    }
                }
                else {
                    console.log('[mqtt_noti_action] rep tag of m2m:sgn.nev is none. m2m:notification format mismatch with oneM2M spec.');
                    contentInstanceObject = null;
                }
            }
            else if(sgnObj.sud) {
                console.log('[mqtt_noti_action] received notification of verification');
                contentInstanceObject = {};
                contentInstanceObject.sud = sgnObj.sud;
            }
            else if(sgnObj.vrq) {
                console.log('[mqtt_noti_action] received notification of verification');
                contentInstanceObject = {};
                contentInstanceObject.vrq = sgnObj.vrq;
            }
            else {
                console.log('[mqtt_noti_action] nev tag of m2m:sgn is none. m2m:notification format mismatch with oneM2M spec.');
                contentInstanceObject = null;
            }
        }
    }
    else {
        console.log(`[mqtt_noti_action] m2m:sgn tag is none. m2m:notification format mismatch with oneM2M spec.\r\n${primitiveContent}`)
    }
    return {pathArray: pathArray, contentInstanceObject: contentInstanceObject};
}