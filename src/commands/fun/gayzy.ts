import {
    ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder
} from 'discord.js';

const GAYZY_MESSAGE = 'Gay?...\nI was gay once...\nThey locked me in a room...\nA rubber room\nA rubber room of cats...\nAnd cats make me gay...';

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName('gayzy')
        .setDescription('I was gay once')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('User to annoy')
                .setRequired(false)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const targetUser = interaction.options.getUser('user');

        if (targetUser) {
            await interaction.reply(`You know what ${targetUser}...\n${GAYZY_MESSAGE}`);
        } else {
            await interaction.reply(GAYZY_MESSAGE);
        }
    }
};