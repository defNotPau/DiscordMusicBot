const XMLHttpRequest = require('xhr2');
const Http = new XMLHttpRequest();

const apiUrl = "http://127.0.0.1:5000/";

module.exports = async (track, artist) => {
    if (artist) { 
        const RequestURL = new URL((`${track}/${artist}`), apiUrl);

        Http.open("GET", RequestURL);
        Http.send();

        Http.responseType = null; // placeholder
    }

    const RequestURL = new URL((`${track}`), apiUrl);
}
