import {
    ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder
} from 'discord.js';

const PLURAL_MESSAGE = '<@1291501048493768784> is a bot used by plural systems to proxy their messages as their system members!\nYou can find more on the bot [online](<https://plural.gg>)';

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName('plural')
        .setDescription('Explain /plu/ral')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user to ping')
                .setRequired(false)
        ),
    
    async execute(interaction: ChatInputCommandInteraction) {
        const targetUser = interaction.options.getUser('user');

        if (targetUser) {
            await interaction.reply(`Hey there, ${targetUser}! ${PLURAL_MESSAGE}`);
        } else {
            await interaction.reply(PLURAL_MESSAGE);
        }
    }
};