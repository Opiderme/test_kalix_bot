const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hello')
		.setDescription('petit bonjour'),
	async execute(interaction) {
        const user = interaction.user;
		await interaction.reply(`Salut ${user} ! Comment vas-tu ?`);
	},
};