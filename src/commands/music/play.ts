import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, CommandInteraction, EmbedBuilder, Interaction } from "discord.js"

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

        const option1 = new ButtonBuilder()
            .setCustomId('1')
            .setLabel("1")
            .setStyle(ButtonStyle.Primary);

        const option2 = new ButtonBuilder()
            .setCustomId('2')
            .setLabel("2")
            .setStyle(ButtonStyle.Primary);
        
        const option3 = new ButtonBuilder()
            .setCustomId('3')
            .setLabel("3")
            .setStyle(ButtonStyle.Primary);

        const option4 = new ButtonBuilder()
            .setCustomId('4')
            .setLabel("4")
            .setStyle(ButtonStyle.Primary);

        const option5 = new ButtonBuilder()
            .setCustomId('5')
            .setLabel("5")
            .setStyle(ButtonStyle.Primary);

        const cancel = new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel("❌")
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(option1, option2, option3, option4, option5, cancel);

        await interaction.reply({ embeds: [optionsEmbed], components: [row],  ephemeral: true });

        const filter = (i: Interaction) => i.isButton() && i.user.id === interaction.user.id;
        const collector = interaction.channel?.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === "cancel") {
                await i.reply({ content: 'Operación cancelada.', ephemeral: true });
                collector.stop();
            } else {
                // more stuff to be added once the API is finished...

                const selectedOption : number = Number(i.customId);

                // take that option and like idk do stuff with it so the bot thingy starts playing it on whatever channel u r on
                await i.reply(`Now playing: ${requestedSong[selectedOption][0]} by ${requestedSong[selectedOption][1]}`);
            }
        });
    }
}