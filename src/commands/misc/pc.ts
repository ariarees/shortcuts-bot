import {
    ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder
} from 'discord.js';

const PC_MESSAGE = 'You can see my PC build over at https://uk.pcpartpicker.com/user/KibbyMeow/saved/#view=MbwK23';

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName('pc')
        .setDescription('My PC Build')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user to ping')
                .setRequired(false)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const targetUser = interaction.options.getUser('user');

        if (targetUser) {
            await interaction.reply(`Hey there, ${targetUser}! ${PC_MESSAGE}`);
        } else {
            await interaction.reply(PC_MESSAGE);
        }
    }
};