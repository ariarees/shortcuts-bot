import {
    ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder
} from 'discord.js';

const REFRESH_MESSAGE = 'To refresh your client to fix bugs or reload commands, use:\nControl + R on Windows and Linux\nCommand(⌘) + R on Mac\nSwipe clear and reopen on Mobile';

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName('refresh')
        .setDescription('Explain how to refresh clients')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user to ping')
                .setRequired(false)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const targetUser = interaction.options.getUser('user');

        if (targetUser) {
            await interaction.reply(`Hey there, ${targetUser}! ${REFRESH_MESSAGE}`);
        } else {
            await interaction.reply(REFRESH_MESSAGE);
        }
    }
};