import {
    ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder
} from 'discord.js';

const PK_MESSAGE = '<@466378653216014359> is a bot used by plural systems to proxy their messages as their system members!\nYou can find more on the bot [online](<https://pluralkit.me>)';

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName('pk')
        .setDescription('Explain PluralKit')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user to ping')
                .setRequired(false)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const targetUser = interaction.options.getUser('user');

        if (targetUser) {
            await interaction.reply(`Hey there, ${targetUser}! ${PK_MESSAGE}`);
        } else {
            await interaction.reply(PK_MESSAGE);
        }
    }
};