const { ApplicationCommandOptionType, EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { devs } = require("../../../config.json");

function apiRequestExample(songName) {
    return [`${songName}`, 90, "John Doe"];
}

const option1 = new ButtonBuilder()
    .setStyle(ButtonStyle.Primary).setCustomId('1').setLabel('1');

const option2 = new ButtonBuilder()
    .setStyle(ButtonStyle.Primary).setCustomId('2').setLabel('2');
        
const option3 = new ButtonBuilder()
    .setStyle(ButtonStyle.Primary).setCustomId('3').setLabel('3');

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
                { name: `1: ${requestedSong[0][0]}`, value: `${secToNicer(requestedSong[0][1])} - by: ${requestedSong[0][2]}`},
                { name: `2: ${requestedSong[1][0]}`, value: `${secToNicer(requestedSong[1][1])} - by: ${requestedSong[1][2]}`},
                { name: `3: ${requestedSong[2][0]}`, value: `${secToNicer(requestedSong[2][1])} - by: ${requestedSong[2][2]}`}
            );

        const row = new ActionRowBuilder()
			.addComponents(option1, option2, option3, cancel);
        
        await interaction.reply({
            embeds: [optionsEmbed],
            components: [row]
        });

        const collectorFilter = i => i.user.id === interaction.user.id;
        try {
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
        } catch(e) {
            await interaction.reply({ content: 'Confirmation not received within 1 minute, cancelling', ephemeral: true, content: [] });
        }
    }
}