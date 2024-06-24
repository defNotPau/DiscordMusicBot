const { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, CommandInteraction, EmbedBuilder } = require("discord.js")

function apiRequestExample(songName: string) {
    var toReturnArray : Array<Array<any>> = [];
    for (var i = 0; i < 4; i++) {
        // just making an array for giving the example...
        // in reality it should make requests and find the first, second, third and so on results given as a callback by the API.
        toReturnArray.push([`${songName} (${i})`, 90, "John Doe"])
    }

    return toReturnArray;
}

function secToNicer(givenSeconds : number) : string {
    var hours = String(Math.floor(givenSeconds / 3600));
    var minutes  = String(Math.floor((givenSeconds - (Number(hours) * 3600)) / 60));
    var seconds = String(givenSeconds - (Number(hours) * 3600) - (Number(minutes) * 60));

    if (Number(hours) < 10) {hours   = "0" + hours;}
    if (Number(minutes) < 10) {minutes = "0" + minutes;}
    if (Number(seconds) < 10) {seconds = "0" + seconds;}

    return `${hours}:${minutes}:${seconds}`
}

module.exports = {
    name: "play",
    description: "Send a song request",
    options: [
        {
            name: "Song",
            description: "The name of the song you would like to play",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],

    callback: async (client, interaction) => {
        const requestedSongName = interaction.options.get("Song").value;
        const requestedSong = apiRequestExample(requestedSongName);

        // API request -> returns a list (5 element)
        // each element in the list another list being in the format [str: title, int: duration (in seconds), str: author(s)]

        // create embed with the options found
        const optionsEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`You serched for: ${requestedSong}`)
            .setDescription("Select one of the found options, or cancel ;c")
            .setTimestamp()
            .addFields(
                { name: `1: ${requestedSong[0][0]}`, value: `${secToNicer(requestedSong[0][1])} - ${requestedSong[0][2]}`},
                { name: `2: ${requestedSong[1][0]}`, value: `${secToNicer(requestedSong[1][1])} - ${requestedSong[1][2]}`},
                { name: `3: ${requestedSong[2][0]}`, value: `${secToNicer(requestedSong[2][1])} - ${requestedSong[2][2]}`},
                { name: `4: ${requestedSong[3][0]}`, value: `${secToNicer(requestedSong[3][1])} - ${requestedSong[3][2]}`},
                { name: `5: ${requestedSong[4][0]}`, value: `${secToNicer(requestedSong[4][1])} - ${requestedSong[4][2]}`}
            );
    }
}