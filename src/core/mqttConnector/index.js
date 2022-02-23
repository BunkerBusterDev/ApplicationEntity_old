exports.initialize = async () => {
    console.log(`[initState] : ${this.initState}`);

    try {
        if (this.initState === 'create_applicationEntity') {
            
        } else if(this.initState === 'retrieve_applicationEntity') {

        } else if(this.initState === 'create_container') {

        } else if(this.initState === 'delete_subscription') {

        } else if(this.initState === 'create_subscription') {

        } else if(this.initState === 'start_httpServer') {

        } else if(this.initState === 'start_tcpServer') {

        } else if(this.initState === 'ready') {

        }
    } catch (error) {
        console.log(error);
    }
}