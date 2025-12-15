import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../types/Command';

const CHEESE_GIF = 'https://cdn.discordapp.com/attachments/1427240630798782514/1446510314018439271/image0.gif';

export const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('cheese')
    .setDescription('Send the cheese GIF!')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User to cheese')
        .setRequired(false)
    ),
  
  async execute(interaction: ChatInputCommandInteraction) {
    const targetUser = interaction.options.getUser('user');
    
    if (targetUser) {
      // When a user is specified, ping them with hidden link
      await interaction.reply(`${targetUser} [.](${CHEESE_GIF})`);
    } else {
      // No user specified, just send the GIF link
      await interaction.reply(CHEESE_GIF);
    }
  }
};