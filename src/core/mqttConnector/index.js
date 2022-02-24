
let initState = 'create-applicationEntity';

exports.initialize = async () => {
    console.log(`[initState] : ${initState}`);

    try {
        if (initState === 'create_applicationEntity') {
            console.log(initState);
        } else if(initState === 'retrieve_applicationEntity') {
            console.log(initState);
        } else if(initState === 'create_container') {
            console.log(initState);
        } else if(initState === 'delete_subscription') {
            console.log(initState);
        } else if(initState === 'create_subscription') {
            console.log(initState);
        } else if(initState === 'start_httpServer') {
            console.log(initState);
        } else if(initState === 'start_tcpServer') {
            console.log(initState);
        } else if(initState === 'ready') {
            console.log(initState);
        }
    } catch (error) {
        console.log(error);
    }
}