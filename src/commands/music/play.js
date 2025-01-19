const { ApplicationCommandOptionType, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require("@discordjs/voice");

const downloadHandler = require("./../../handlers/api/downloadHandler");

const confirm = new ButtonBuilder()
    .setStyle(ButtonStyle.Primary).setCustomId('confirm').setLabel('✅');

const cancel = new ButtonBuilder()
    .setStyle(ButtonStyle.Secondary).setCustomId('cancel').setLabel('❌');

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
        await interaction.deferReply();
        var requestedSong = await downloadHandler(interaction.options.getString("song"), interaction.options.getString("artist"));
        console.log(requestedSong);

        if (!requestedSong) { interaction.reply("Error... contact devs :D"); };

        const optionsEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`You serched for: ${(interaction.options.getString("song")).replaceAll("+", " ")}`)
            .setDescription("Select confirm, or cancel ;c")
            .setTimestamp()
            .addFields(
                { name: `${requestedSong.name}`, value: `${requestedSong.duration} | by: ${requestedSong.author}`}
            );

        const row = new ActionRowBuilder()
			.addComponents(confirm, cancel);
        
        const response = await interaction.editReply({
            embeds: [optionsEmbed],
            components: [row]
        });

        const collectorFilter = i => i.user.id === interaction.user.id;
        try {
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000});

            await confirmation.deferReply();

            if (confirmation.customId === 'confirm') {
                if (!interaction.member.voice.channel) return interaction.editReply("You need to be in a Voice Channel to play a song.");
                const song_resource = createAudioPlayer();
                joinVoiceChannel({
                    channelId: interaction.member.voice.channelId,
                    guildId: interaction.guildId,
                    adapterCreator: interaction.guild.voiceAdapterCreator
                }).subscribe(song_resource)
                let resource = createAudioResource(`../../../api/output/${String()}`);
                
                song_resource.play(resource);
            }

            if (confirmation.customId === 'cancel') {
                await confirmation.editReply({ content: 'Canceled D:', components: [] });
            }
        } catch(e) {
            console.log(e);
            await interaction.editReply({ content: "Time's up >:) \n or there was an error... if you think so, ask the developers :D", components: [] });
        }
    }
}

