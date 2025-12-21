import {
    ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuInteraction,
    ComponentType,
    MessageFlags
} from 'discord.js';
import { doughAPI } from '../../utils/doughAPI';

export default {
    data: new SlashCommandSubcommandBuilder()
        .setName('remove')
        .setDescription('Remove a member from the front'),

    async execute(interaction: ChatInputCommandInteraction) {
        try {
            // Defer reply as this might take a moment
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });

            // Get current fronters
            const frontersData = await doughAPI.getFronters();
            const fronters = frontersData.members || [];

            if (!fronters || fronters.length === 0) {
                await interaction.editReply({
                    content: '❌ No one is currently fronting!'
                });
                return;
            }

            // Create select menu with current fronters
            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('select_member_to_remove')
                .setPlaceholder('Select a member to remove from front')
                .addOptions(
                    fronters.slice(0, 25).map((member: any) => ({
                        label: member.name,
                        description: member.pronouns || 'No pronouns set',
                        value: member.id,
                        emoji: member.tags && member.tags.length > 0 ? member.tags[0] : undefined
                    }))
                );

            const row = new ActionRowBuilder<StringSelectMenuBuilder>()
                .addComponents(selectMenu);

            const embed = new EmbedBuilder()
                .setColor(0x5865F2)
                .setTitle('➖ Remove Member from Front')
                .setDescription('Select a member from the dropdown below to remove them from the front.')
                .addFields({
                    name: 'Current Fronters',
                    value: fronters.map((f: any) => `• ${f.name}`).join('\n')
                })
                .setFooter({ text: 'Selection will expire in 60 seconds' });

            const response = await interaction.editReply({
                embeds: [embed],
                components: [row]
            });

            // Create collector for select menu
            const collector = response.createMessageComponentCollector({
                componentType: ComponentType.StringSelect,
                time: 60_000 // 1 minute
            });

            collector.on('collect', async (i: StringSelectMenuInteraction) => {
                // Only allow the original user to use the select menu
                if (i.user.id !== interaction.user.id) {
                    await i.reply({
                        content: 'This menu is not for you!',
                        ephemeral: true
                    });
                    return;
                }

                const selectedMemberId = i.values[0];
                const selectedMember = fronters.find((m: any) => m.id === selectedMemberId);

                try {
                    // Remove the member from front
                    const result = await doughAPI.removeFronter(selectedMemberId);

                    if (result.success) {
                        const successEmbed = new EmbedBuilder()
                            .setColor(0x57F287) // Green
                            .setTitle('✅ Member Removed from Front')
                            .setDescription(`**${selectedMember?.name}** has been removed from the front.`)
                            .addFields({
                                name: 'Current Fronters',
                                value: result.fronters.length > 0
                                    ? result.fronters.map((f: any) => `• ${f.name}`).join('\n')
                                    : 'None'
                            })
                            .setTimestamp();

                        await i.update({
                            embeds: [successEmbed],
                            components: []
                        });
                    } else {
                        const errorEmbed = new EmbedBuilder()
                            .setColor(0xED4245) // Red
                            .setTitle('❌ Failed to Remove Member')
                            .setDescription(result.message)
                            .setTimestamp();

                        await i.update({
                            embeds: [errorEmbed],
                            components: []
                        });
                    }

                    collector.stop();
                } catch (error) {
                    const errorEmbed = new EmbedBuilder()
                        .setColor(0xED4245)
                        .setTitle('❌ Error')
                        .setDescription(`Failed to remove member: ${error instanceof Error ? error.message : 'Unknown error'}`)
                        .setTimestamp();

                    await i.update({
                        embeds: [errorEmbed],
                        components: []
                    });

                    collector.stop();
                }
            });

            collector.on('end', async (collected) => {
                if (collected.size === 0) {
                    // Timeout - disable the select menu
                    const timeoutEmbed = new EmbedBuilder()
                        .setColor(0xFEE75C) // Yellow
                        .setTitle('⏱️ Selection Timed Out')
                        .setDescription('You took too long to select a member. Please run the command again.')
                        .setTimestamp();

                    try {
                        await interaction.editReply({
                            embeds: [timeoutEmbed],
                            components: []
                        });
                    } catch (error) {
                        // Message might have been deleted
                    }
                }
            });

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