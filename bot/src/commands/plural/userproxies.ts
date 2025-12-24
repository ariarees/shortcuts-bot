import {
    ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder
} from 'discord.js';

const USERPROXY_MESSAGE = 'You can setup a Userproxy using this guide <https://youtu.be/spRkTssPCqg>!';

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName('userproxies')
        .setDescription('Send the tutorial on how to setup a userproxy')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('User to ping')
                .setRequired(false)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const targetUser = interaction.options.getUser('user');

        if (targetUser) {
            await interaction.reply(`Hey there ${targetUser}! ${USERPROXY_MESSAGE}`);
        } else {
            await interaction.reply(USERPROXY_MESSAGE);
        }
    }
};