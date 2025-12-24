import {
    ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder,
    EmbedBuilder,
    MessageFlags
} from 'discord.js';
import { doughAPI } from '../../utils/doughAPI';

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName('remove')
        .setDescription('Remove a member from the front')
        .addStringOption(option =>
            option
                .setName('member')
                .setDescription('Member name (searches display name)')
                .setRequired(true)
                .setAutocomplete(true)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });

            const memberQuery = interaction.options.getString('member', true);

            // Get current fronters
            const frontersData = await doughAPI.getFronters();
            const fronters = frontersData.members || [];

            if (!fronters || fronters.length === 0) {
                await interaction.editReply({
                    content: '❌ No one is currently fronting!'
                });
                return;
            }

            // Search for member by display name (case-insensitive)
            const searchQuery = memberQuery.toLowerCase();
            const foundMember = fronters.find((m: any) => 
                (m.display_name || m.name).toLowerCase() === searchQuery ||
                m.name.toLowerCase() === searchQuery
            );

            if (!foundMember) {
                // Try partial match
                const partialMatches = fronters.filter((m: any) =>
                    (m.display_name || m.name).toLowerCase().includes(searchQuery) ||
                    m.name.toLowerCase().includes(searchQuery)
                );

                if (partialMatches.length === 0) {
                    await interaction.editReply({
                        content: `❌ No fronting member found matching "${memberQuery}"\n\nCurrently fronting: ${fronters.map((f: any) => f.display_name || f.name).join(', ')}`
                    });
                    return;
                }

                if (partialMatches.length === 1) {
                    // Only one partial match, use it
                    const member = partialMatches[0];
                    await removeMemberFromFront(interaction, member);
                    return;
                }

                // Multiple matches - show options
                const matchList = partialMatches
                    .slice(0, 10)
                    .map((m: any) => `• ${m.display_name || m.name}`)
                    .join('\n');

                await interaction.editReply({
                    content: `❌ Multiple fronting members found matching "${memberQuery}":\n${matchList}\n\nPlease be more specific.`
                });
                return;
            }

            // Exact match found
            await removeMemberFromFront(interaction, foundMember);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            
            const errorEmbed = new EmbedBuilder()
                .setColor(0xED4245)
                .setTitle('❌ Error')
                .setDescription(`Failed to remove member: ${errorMessage}`)
                .setTimestamp();

            if (interaction.deferred) {
                await interaction.editReply({ embeds: [errorEmbed] });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    }
};

async function removeMemberFromFront(
    interaction: ChatInputCommandInteraction,
    member: any
) {
    try {
        // Get current fronters again to ensure we have the latest state
        const currentFronters = await doughAPI.getFronters();
        const currentMemberIds: string[] = currentFronters.members?.map((m: any) => m.id) || [];
        
        // Check if member is still fronting
        if (!currentMemberIds.includes(member.id)) {
            const infoEmbed = new EmbedBuilder()
                .setColor(0xFEE75C) // Yellow
                .setTitle('ℹ️ Not Fronting')
                .setDescription(`**${member.display_name || member.name}** is not currently fronting!`)
                .setTimestamp();

            await interaction.editReply({ embeds: [infoEmbed] });
            return;
        }
        
        // Remove the member from the fronters list
        const newMemberIds: string[] = currentMemberIds.filter((id: string) => id !== member.id);
        const result = await doughAPI.multiSwitch(newMemberIds);

        if (result.status === 'success') {
            const successEmbed = new EmbedBuilder()
                .setColor(0x57F287) // Green
                .setTitle('✅ Member Removed from Front')
                .setDescription(`**${member.display_name || member.name}** has been removed from the front.`)
                .addFields({
                    name: 'Current Fronters',
                    value: result.fronters.length > 0
                        ? result.fronters.map((f: any) => `• ${f.display_name || f.name}`).join('\n')
                        : 'None'
                })
                .setTimestamp();

            await interaction.editReply({ embeds: [successEmbed] });
        } else {
            const errorEmbed = new EmbedBuilder()
                .setColor(0xED4245) // Red
                .setTitle('❌ Failed to Remove Member')
                .setDescription(result.message || 'Unknown error occurred')
                .setTimestamp();

            await interaction.editReply({ embeds: [errorEmbed] });
        }
    } catch (error) {
        const errorEmbed = new EmbedBuilder()
            .setColor(0xED4245)
            .setTitle('❌ Error')
            .setDescription(`Failed to remove member: ${error instanceof Error ? error.message : 'Unknown error'}`)
            .setTimestamp();

        await interaction.editReply({ embeds: [errorEmbed] });
    }
}