const { ApplicationCommandOptionType, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const apiHandler = require('./../../handlers/apiHandler');

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
        if (interaction.options.getString("artist")) {
            var requestedSong = await apiHandler(interaction.options.getString("song"), interaction.options.getString("artist"));
        } else {
            var requestedSong = await apiHandler(interaction.options.getString("song"));
        }

        const optionsEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`You serched for: ${requestedSong.id}`)
            .setDescription("Select confirm, or cancel ;c")
            .setTimestamp()
            .addFields(
                { name: `${requestedSong.name}`, value: `${requestedSong.duration} | by: ${requestedSong.author}`}
                
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