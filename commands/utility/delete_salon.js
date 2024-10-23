const { SlashCommandBuilder } = require('discord.js');
const { guildId } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete_salon')
        .setDescription('Supprimer un salon grace a son nom')
        .addStringOption(option =>
            option.setName('nom-du-salon')
                .setDescription('Nom du salon à supprimer')
                .setRequired(true)),
    async execute(interaction) {
        try {
            const guild = await interaction.guild.fetch();
            const salonName = interaction.options.getString('nom-du-salon');
            
            // Recherche du salon par son nom
            const salon = guild.channels.cache.find(channel => channel.type != 4 && channel.name === salonName);
            
            if (salon) {
                guild.channels.delete(salon, 'making room for new channels')
                .then(channel => {
                    console.log(`Le salon textuel "${salonName}" a bien été delete !`);
                    interaction.reply(`Le salon textuel "${salonName}" a bien été delete !`);
                })
                .catch(error => {
                    console.error('Une erreur s\'est produite lors de la suppression du salon textuel :', error);
                    interaction.reply('Une erreur s\'est produite lors de la suppression du salon textuel.');
                });
            } else {
                await interaction.reply(`Aucun salon trouvé avec le nom "${salonName}"`);
            }
        } catch (error) {
            console.error('Une erreur s\'est produite lors de la recherche du salon :', error);
            await interaction.reply('Une erreur s\'est produite lors de la recherche du salon.');
        }
    },
};
