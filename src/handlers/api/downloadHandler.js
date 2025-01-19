
const apiUrl = "http://127.0.0.1:5000/";
const apiInfo = "http://127.0.0.1:5000/info/"

module.exports = async (track, artist) => {
    var trackName;
    if (artist) { 
        var trackName = `${String(track).replaceAll(" ", "+")}-${String(artist).replaceAll(" ", "+")}`;
    } else {
        var trackName = `${String(track).replaceAll(" ", "+")}`;
    }
    
    async function doAsyncCall(url) {
        const serverResult = await fetch(url);
        return serverResult;
    }

    var songURL = new URL(trackName, apiUrl);
    await doAsyncCall(songURL.href)

    var jsonURL = new URL(trackName, apiInfo);
    jsonResult = await doAsyncCall(jsonURL.href);
    return(jsonResult.json());   
}

