import {
    ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder
} from 'discord.js';

const PLURALITY_MESSAGE = 'Plurality (or multiplicity) is the existence of multiple self-aware entities inside one physical brain.\nYou can find some simple information [here](<https://morethanone.info>)\nand some more advanced info [here](<https://pluralpedia.org/w/Main_Page>)';

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName('plurality')
        .setDescription('Send information about plurality')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('User to ping')
                .setRequired(false)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const targetUser = interaction.options.getUser('user');

        if (targetUser) {
            await interaction.reply(`Hey there ${targetUser}! ${PLURALITY_MESSAGE}`);
        } else {
            await interaction.reply(PLURALITY_MESSAGE);
        }
    }
};