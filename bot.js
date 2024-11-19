require('dotenv').config();
const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} = require('discord.js');

const BOT_TOKEN = process.env.BOT_TOKEN;
const INITIAL_CHANNEL_NAME = '🟢●-status';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content === '!status') {
        try {
            const embed = new EmbedBuilder()
                .setTitle('Change Status')
                .setDescription('Click 📖 to toggle the status channel name.')
                .setImage('https://i5.walmartimages.com/seo/Unbranded-Durable-Plastic-Open-and-Closed-Sign-with-Clock-Blue-White-11-5-in-x-6-in-1-Count_2b0d0fec-7f2d-49fb-a079-03c3c872c0c6_1.8ccd5cef58f6e52036e5ef8c3d1949ff.jpeg') // Replace with a valid image link
                .setColor(0x00ae86)
                .setFooter({ text: 'Status Toggle Bot' });

            const button = new ButtonBuilder()
                .setCustomId('toggle_status')
                .setLabel('📖')
                .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder().addComponents(button);

            await message.channel.send({ embeds: [embed], components: [row] });
        } catch (error) {
            console.error('Error in !status command:', error);
            await message.reply('An error occurred while setting up the status toggle.');
        }
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    try {
        await interaction.deferReply({ ephemeral: true });

        const channel = interaction.guild.channels.cache.find(
            (c) => c.name === INITIAL_CHANNEL_NAME || c.name === '🔴●-status'
        );

        if (!channel) {
            await interaction.editReply({ content: 'Channel not found. Please check the channel name.' });
            return;
        }

        const newName = channel.name === '🟢●-status' ? '🔴●-status' : '🟢●-status';
        await channel.edit({ name: newName });
        await interaction.editReply({ content: `Channel name changed to \`${newName}\`.` });
    } catch (error) {
        console.error('Error handling interaction:', error);
        await interaction.editReply({ content: 'An error occurred while processing your request.' });
    }
});

client.login(BOT_TOKEN);
