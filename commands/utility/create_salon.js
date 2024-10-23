const { SlashCommandBuilder } = require('discord.js');
const { guildId } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create_salon')
        .setDescription('cree un nouveau salon')
        .addStringOption(option =>
            option.setName('nom-du-salon')
                .setDescription('Nom du nouveau salon')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('nom-du-parent')
                .setDescription('Nom de la categorie parent du salon')
                .setRequired(false)),
    async execute(interaction) {
        try {
            const guild = await interaction.guild.fetch();
            const channelName = interaction.options.getString('nom-du-salon');
            const categoryName = interaction.options.getString('nom-du-parent');
            
            // Récupérer la catégorie parente à partir de son nom
            let category = null;
            if (categoryName) {
                category = guild.channels.cache.find(channel => channel.type === 4 && channel.name === categoryName);
                if (!category) {
                    throw new Error(`La catégorie "${categoryName}" n'a pas été trouvée.`);
                }
            }

            // Create a new text channel
            guild.channels.create({ name: channelName, parent: category, reason: 'Needed a cool new channel' })
            .then(channel => {
                console.log(`Le salon textuel "${channel.name}" a été créé avec succès !`);
                interaction.reply(`Le salon textuel "${channel.name}" a été créé avec succès !`);
            })
            .catch(error => {
                console.error('Une erreur s\'est produite lors de la création du salon textuel :', error);
                interaction.reply('Une erreur s\'est produite lors de la création du salon textuel.');
            });
        } catch (error) {
            console.error('Une erreur s\'est produite lors de la création du salon textuel :', error);
            await interaction.reply('Une erreur s\'est produite lors de la création du salon textuel.');
        }
    },
};
