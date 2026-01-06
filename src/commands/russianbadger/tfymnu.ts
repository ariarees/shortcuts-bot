import {
    ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder
} from 'discord.js';

const russianbadger = 'https://tenor.com/view/fuck-you-mean-nuh-uh-russianbadger-gif-9533939439312977138';

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName('tfymnu')
        .setDescription('THE FUCK YOU MEAN NUH UH')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('Target User')
                .setRequired(false)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const targetUser = interaction.options.getUser('user');

        if (targetUser) {
            await interaction.reply(`${targetUser}[.](${russianbadger})`);
        } else {
            await interaction.reply(russianbadger);
        }
    }
};