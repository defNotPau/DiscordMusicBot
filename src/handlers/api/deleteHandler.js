const apiUrl = new URL("http://127.0.0.1:5000/del");

module.exports = async () => {

    const serverResult = await fetch(apiUrl.href);
    return (serverResult);
}