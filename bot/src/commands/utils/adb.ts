import {
    ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder
} from 'discord.js';

const ADB_MESSAGE = 'Starting December 5, 2025, the active developer badge has been **removed**, and is **no longer** obtainable. There are also *no* plans for a new badge replacing this.';

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName('adb')
        .setDescription('Info about the Active Developer Badge')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('User to inform about the badge')
                .setRequired(false)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const targetUser = interaction.options.getUser('user');

        if (targetUser) {
            await interaction.reply(`Hey there, ${targetUser}! ${ADB_MESSAGE}`);
        } else {
            await interaction.reply(ADB_MESSAGE);
        }
    }
};