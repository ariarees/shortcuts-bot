import {
    ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder,
    EmbedBuilder,
    MessageFlags
} from 'discord.js';
import { doughAPI } from '../../utils/doughAPI';

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName('check')
        .setDescription('Check who is currently fronting'),

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });

            // Get current fronters
            const frontersData = await doughAPI.getFronters();
            const fronters = frontersData.members || [];

            if (!fronters || fronters.length === 0) {
                const noFrontersEmbed = new EmbedBuilder()
                    .setColor(0xFEE75C) // Yellow
                    .setTitle('👥 Current Fronters')
                    .setDescription('No one is currently fronting.')
                    .setTimestamp();

                await interaction.editReply({ embeds: [noFrontersEmbed] });
                return;
            }

            // Build the fronters list with details
            const frontersList = fronters.map((f: any) => {
                const displayName = f.display_name || f.name;
                const actualName = f.display_name ? f.name : null;
                
                // If display_name exists and is different from name, show both
                if (actualName && actualName !== displayName) {
                    return `• **${displayName}** (${actualName})`;
                }
                return `• **${displayName}**`;
            }).join('\n');

            const frontersEmbed = new EmbedBuilder()
                .setColor(0x57F287) // Green
                .setTitle('👥 Current Fronters')
                .setDescription(frontersList)
                .addFields({
                    name: 'Total',
                    value: `${fronters.length} member${fronters.length !== 1 ? 's' : ''} fronting`,
                    inline: true
                })
                .setFooter({ text: 'Fronting status' })
                .setTimestamp();

            await interaction.editReply({ embeds: [frontersEmbed] });

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            
            const errorEmbed = new EmbedBuilder()
                .setColor(0xED4245)
                .setTitle('❌ Error')
                .setDescription(`Failed to check fronters: ${errorMessage}`)
                .setTimestamp();

            if (interaction.deferred) {
                await interaction.editReply({ embeds: [errorEmbed] });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    }
};