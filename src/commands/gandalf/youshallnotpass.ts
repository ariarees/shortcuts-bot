import {
    ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder
} from 'discord.js';

const SHALLNOTPASS = 'https://tenor.com/view/lord-of-the-rings-you-shall-not-pass-not-pass-gandal-the-grey-gandalf-gif-7706023';

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName('youshallnotpass')
        .setDescription('You shall not pass!')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Target user')
                .setRequired(false)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        const targetUser = interaction.options.getUser('user');

        if (targetUser) {
            await interaction.reply(`${targetUser}[.](${SHALLNOTPASS})`);
        } else {
            await interaction.reply(SHALLNOTPASS);
        }
    }
};