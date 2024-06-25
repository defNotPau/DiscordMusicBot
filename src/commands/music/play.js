const { ApplicationCommandOptionType, EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

function apiRequestExample(songName, artist) {
    if (artist) { return [songName, '2:30', artist]; }
    return [songName, '2:30', 'unknown_artist'];
}

function findSong(songName) {

}

const confirm = new ButtonBuilder()
    .setStyle(ButtonStyle.Primary).setCustomId('confirm').setLabel('✅');

const cancel = new ButtonBuilder()
    .setStyle(ButtonStyle.Primary).setCustomId('cancel').setLabel('❌');

module.exports = {
    name: "play",
    description: "Send a song request",
    options: [
        {
            name: "song",
            description: "The name of the song you would like to play",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "artist",
            description: "Artist of the song you want to play",
            type: ApplicationCommandOptionType.String,
        }
    ],

    callback: async (client, interaction) => {
        const requestedSong = apiRequestExample(interaction.options.getString("Song"));
        if (!requestedSong[2]) { interaction.reply({content: "ehhhhhh... sorry, something happened ;c"}) }

        // API request -> returns a list (5 element)
        // each element in the list another list being in the format [str: title, int: duration (in seconds), str: author(s)]

        // create embed with the options found
        const optionsEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`You serched for: ${requestedSong}`)
            .setDescription("Select one of the found options, or cancel ;c \n you have a minute to answer which one")
            .setTimestamp()
            .addFields(
                { name: `1: ${requestedSong[0]}`, value: `${secToNicer(requestedSong[1])} - by: ${requestedSong[2]}`}
                
            );

        const row = new ActionRowBuilder()
			.addComponents(confirm, cancel);
    
        await interaction.reply({
            embeds: [optionsEmbed],
            components: [row]
        });

        const collectorFilter = i => i.user.id === interaction.user.id;
        try {
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

            if (confirmation.customId === 'confirm') {

            }
        } catch(e) {
            await interaction.reply({ content: 'Confirmation not received within 1 minute, cancelling', ephemeral: true, content: [] });
        }
    }
}