const XMLHttpRequest = require('xhr2');
const Http = new XMLHttpRequest();

const apiUrl = "http://127.0.0.1:5000/download";

module.exports = async (track, artist) => {
    if (artist) { 
        var RequestURL = apiUrl + `/${track}/${artist}`;
    } else {
        var RequestURL = apiUrl + `/${track}`;
    }

    Http.open("GET", RequestURL, true);
    Http.send();

    Http.responseType = "json";
    
    Http.readyStateChange = function() {
        function check() {
            setTimeout(function () {
              if (Http.response == undefined) {
                console.log('undefined >:(')
                check();
              } else {
                console.log('maybe not undefined :)')
                return;
              }
            }, 500);
        };
        check();

        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                return JSON.parse(Http.response);
            } else {
            console.error("Error: " + Http.status);
            }
        }
    }
}
