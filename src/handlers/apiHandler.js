const apiUrl = "http://127.0.0.1:5000";

module.exports = async (track, artist) => {
    if (artist) { 
        var RequestURL = new URL(`download/${track}/${artist}`, apiUrl);
    } else {
        var RequestURL = new URL(`download/${track}`, apiUrl);
    }

    let result;
    async function doAsyncCall(url) {
        const serverResult = await fetch(url);
        return serverResult.json();
    }

    myServerResult = await doAsyncCall(RequestURL.href);
    return(myServerResult);   
}
