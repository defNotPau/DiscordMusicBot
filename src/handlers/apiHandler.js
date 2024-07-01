const XMLHttpRequest = require('xhr2');
const Http = new XMLHttpRequest();

const apiUrl = "http://127.0.0.1:5000/download";

module.exports = async (track, artist) => {
    if (artist) { 
        const RequestURL = new URL((`${track}/${artist}`), apiUrl);
    } else {
        const RequestURL = new URL((`${track}`), apiUrl);
    }

    Http.open("GET", RequestURL);
    Http.send();

    Http.responseType = "json";

    if (Http.responseText) {
        return Http.responseText;
    } else {
        return 'error ;c';
    }
}
