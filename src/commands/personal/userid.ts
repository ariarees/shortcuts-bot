import {
    ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder
} from 'discord.js';

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName('userid')
        .setDescription('Display personal userid'),

    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply(`1025770042245251122`);
    }
};