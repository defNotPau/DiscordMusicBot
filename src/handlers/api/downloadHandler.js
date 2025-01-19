const apiUrl = "http://127.0.0.1:5000/";
const apiInfo = "http://127.0.0.1:5000/info"

module.exports = async (track, artist) => {
    var trackURL;
    if (artist) { 
        var trackURL = new URL(`${String(track).replaceAll(" ", "+")}-${String(artist).replaceAll(" ", "+")}`);
    } else {
        var trackURL = new URL(`${String(track).replaceAll(" ", "+")}`);
    }
    
    async function doAsyncCall(url) {
        const serverResult = await fetch(url);
        return serverResult;
    }

    var songURL = new URL(trackURL, apiUrl);
    await doAsyncCall(songURL.href)

    var jsonURL = new URL(trackURL, apiInfo);
    jsonResult = await doAsyncCall(jsonURL.href);
    return(jsonResult.json());   
}
