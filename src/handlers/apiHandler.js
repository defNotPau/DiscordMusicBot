const apiUrl = "http://127.0.0.1:5000";

module.exports = async (req, track, artist) => {
    if (req == "GET") {
        if (artist) { 
            var RequestURL = new URL(`download/${track}/${artist}`, apiUrl);
        } else {
            var RequestURL = new URL(`download/${track}`, apiUrl);
        }
    } if (req == "DEL") {
        var RequestURL = new URL(`delete/${songId}`, "http://127.0.0.1:5000");
    } else {
        return;
    }

    async function doAsyncCall(url) {
        const serverResult = await fetch(url);
        return serverResult.json();
    }

    myServerResult = await doAsyncCall(RequestURL.href);
    return(myServerResult);   
}
