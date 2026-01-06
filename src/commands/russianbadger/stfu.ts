import {
    ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder
} from 'discord.js';

const russianbadger = 'https://tenor.com/view/badger-russianbadger-therussianbadger-russianbadger-your-honor-therussianbadger-your-honor-gif-17976630367246948183';

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName('stfu')
        .setDescription('Your honour. You wasn\'t even there.')
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