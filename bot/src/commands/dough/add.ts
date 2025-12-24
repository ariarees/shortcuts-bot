import {
    ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder,
    EmbedBuilder,
    MessageFlags
} from 'discord.js';
import { doughAPI } from '../../utils/doughAPI';

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName('add')
        .setDescription('Add a member to the front')
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

            // Get all members
            const members = await doughAPI.getMembers();

            if (!members || members.length === 0) {
                await interaction.editReply({
                    content: '❌ Could not fetch members from the system.'
                });
                return;
            }

            // Search for member by display name (case-insensitive)
            const searchQuery = memberQuery.toLowerCase();
            const foundMember = members.find((m: any) => 
                (m.display_name || m.name).toLowerCase() === searchQuery ||
                m.name.toLowerCase() === searchQuery
            );

            if (!foundMember) {
                // Try partial match
                const partialMatches = members.filter((m: any) =>
                    (m.display_name || m.name).toLowerCase().includes(searchQuery) ||
                    m.name.toLowerCase().includes(searchQuery)
                );

                if (partialMatches.length === 0) {
                    await interaction.editReply({
                        content: `❌ No member found matching "${memberQuery}"`
                    });
                    return;
                }

                if (partialMatches.length === 1) {
                    // Only one partial match, use it
                    const member = partialMatches[0];
                    await addMemberToFront(interaction, member, members);
                    return;
                }

                // Multiple matches - show options
                const matchList = partialMatches
                    .slice(0, 10)
                    .map((m: any) => `• ${m.display_name || m.name}`)
                    .join('\n');

                await interaction.editReply({
                    content: `❌ Multiple members found matching "${memberQuery}":\n${matchList}\n\nPlease be more specific.`
                });
                return;
            }

            // Exact match found
            await addMemberToFront(interaction, foundMember, members);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            
            const errorEmbed = new EmbedBuilder()
                .setColor(0xED4245)
                .setTitle('❌ Error')
                .setDescription(`Failed to add member: ${errorMessage}`)
                .setTimestamp();

            if (interaction.deferred) {
                await interaction.editReply({ embeds: [errorEmbed] });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    }
};

async function addMemberToFront(
    interaction: ChatInputCommandInteraction,
    member: any,
    allMembers: any[]
) {
    try {
        // Get current fronters
        const currentFronters = await doughAPI.getFronters();
        const currentMemberIds: string[] = currentFronters.members?.map((m: any) => m.id) || [];
        
        // Check if member is already fronting
        if (currentMemberIds.includes(member.id)) {
            const infoEmbed = new EmbedBuilder()
                .setColor(0xFEE75C) // Yellow
                .setTitle('ℹ️ Already Fronting')
                .setDescription(`**${member.display_name || member.name}** is already in the front!`)
                .addFields({
                    name: 'Current Fronters',
                    value: currentFronters.members.length > 0
                        ? currentFronters.members.map((f: any) => `• ${f.display_name || f.name}`).join('\n')
                        : 'None'
                })
                .setTimestamp();

            await interaction.editReply({ embeds: [infoEmbed] });
            return;
        }
        
        // Add the new member to the existing fronters
        const newMemberIds: string[] = [...currentMemberIds, member.id];
        const result = await doughAPI.multiSwitch(newMemberIds);

        if (result.status === 'success') {
            const successEmbed = new EmbedBuilder()
                .setColor(0x57F287) // Green
                .setTitle('✅ Member Added to Front')
                .setDescription(`**${member.display_name || member.name}** has been added to the front!`)
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
                .setTitle('❌ Failed to Add Member')
                .setDescription(result.message || 'Unknown error occurred')
                .setTimestamp();

            await interaction.editReply({ embeds: [errorEmbed] });
        }
    } catch (error) {
        const errorEmbed = new EmbedBuilder()
            .setColor(0xED4245)
            .setTitle('❌ Error')
            .setDescription(`Failed to add member: ${error instanceof Error ? error.message : 'Unknown error'}`)
            .setTimestamp();

        await interaction.editReply({ embeds: [errorEmbed] });
    }
}