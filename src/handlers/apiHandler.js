const XMLHttpRequest = require('xhr2');
const Http = new XMLHttpRequest();

const apiUrl = "http://127.0.0.1:5000/";

module.exports = async (server, action,) => {
    const RequestURL = new URL((action+'/'+server), apiUrl);
    if (action == 'start' || action == 'stop') {
        Http.open("GET", RequestURL.href);
        Http.send();

        if (Http.responseText == null) {
            console.log('El commando fallo, revisa la consola de API')
            return false;
        } else {
            return true;
        }
    }
    
    
    if (action == 'status/players') {
        let myServerResult;
        async function doAsyncCall(url) {
            const serverResult = await fetch(url);
            return serverResult
        }

        myServerResult = await doAsyncCall(RequestURL.href) 
        console.log(myServerResult)
        return(myServerResult)       
    }
}
