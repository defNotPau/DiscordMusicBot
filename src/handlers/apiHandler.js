const apiUrl = "http://127.0.0.1:5000/";

module.exports = async (track, artist) => {

    if (artist) { 
        var RequestURL = new URL(`${String(track).replaceAll(" ", "+")}/+${String(artist).replaceAll(" ", "+")}`, apiUrl);
    } else {
        var RequestURL = new URL(`${String(track).replaceAll(" ", "+")}`, apiUrl);
    }
    async function doAsyncCall(url) {
        const serverResult = await fetch(url);
        return serverResult.json();
    }

    myServerResult = await doAsyncCall(RequestURL.href);
    return(myServerResult);   
}
