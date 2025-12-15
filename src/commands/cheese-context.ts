import { ApplicationCommandType, ContextMenuCommandBuilder, UserContextMenuCommandInteraction } from 'discord.js';
import { UserContextMenuCommand } from '../types/Command';

const CHEESE_GIF = 'https://cdn.discordapp.com/attachments/1427240630798782514/1446510314018439271/image0.gif';

export const command: UserContextMenuCommand = {
  data: new ContextMenuCommandBuilder()
    .setName('Cheese')
    .setType(ApplicationCommandType.User),
  
  async execute(interaction: UserContextMenuCommandInteraction) {
    const targetUser = interaction.targetUser;
    
    // Ping them with hidden link just like the slash command
    await interaction.reply(`${targetUser} [.](${CHEESE_GIF})`);
  }
};