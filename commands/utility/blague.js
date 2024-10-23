const BlaguesAPI = require('blagues-api');
const blagues = new BlaguesAPI('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjkyMzE4MzE4OTE2NTM0MjgzIiwibGltaXQiOjEwMCwia2V5IjoiYmEwc3BsaGtDMEpzT3VaQ1U5VWY2YVR5b0RMTnBPUmlXRks2dVJCd1dFcEJObTNqZlQiLCJjcmVhdGVkX2F0IjoiMjAyNC0wMy0zMVQxMDowMTozMiswMDowMCIsImlhdCI6MTcxMTg3OTI5Mn0.RerscVESLcO-0mSg7Z22bIpCe01P3Z5MjrL4wLAcuGg');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('blague')
		.setDescription('petite blague ?'),
	async execute(interaction) {
        const blague = await blagues.randomCategorized(
			blagues.categories.DARK
		  );
        console.log(blague);
		await interaction.reply(`${blague['joke']}\n~\n||${blague['answer']}||`);
	},
}; 