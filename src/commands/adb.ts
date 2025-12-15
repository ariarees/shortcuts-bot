import { 
  ApplicationCommandType,
  ChatInputCommandInteraction, 
  SlashCommandBuilder,
  ContextMenuCommandBuilder,
  UserContextMenuCommandInteraction,
  MessageContextMenuCommandInteraction
} from 'discord.js';
import { SlashCommand, UserContextMenuCommand, MessageContextMenuCommand } from '../types/Command';

const ADB_MESSAGE = 'Starting December 5, 2025, the active developer badge has been **removed**, and is **no longer** obtainable. There are also *no* plans for a new badge replacing this.';

// Slash command: /adb [user]
export const slashCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('adb')
    .setDescription('Info about the Active Developer Badge')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('User to inform about the badge')
        .setRequired(false)
    ),
  
  async execute(interaction: ChatInputCommandInteraction) {
    const targetUser = interaction.options.getUser('user');
    
    if (targetUser) {
      await interaction.reply(`Hey there, ${targetUser}! ${ADB_MESSAGE}`);
    } else {
      await interaction.reply(ADB_MESSAGE);
    }
  }
};

// User context menu: Right-click user → Apps → DevBadge
export const userContextCommand: UserContextMenuCommand = {
  data: new ContextMenuCommandBuilder()
    .setName('DevBadge')
    .setType(ApplicationCommandType.User),
  
  async execute(interaction: UserContextMenuCommandInteraction) {
    const targetUser = interaction.targetUser;
    await interaction.reply(`Hey there, ${targetUser}! ${ADB_MESSAGE}`);
  }
};

// Message context menu: Right-click message → Apps → DevBadge
export const messageContextCommand: MessageContextMenuCommand = {
  data: new ContextMenuCommandBuilder()
    .setName('DevBadge')
    .setType(ApplicationCommandType.Message),
  
  async execute(interaction: MessageContextMenuCommandInteraction) {
    const targetUser = interaction.targetMessage.author;
    await interaction.reply(`Hey there, ${targetUser}! ${ADB_MESSAGE}`);
  }
};

// Export all commands as an array for the command handler
export const commands = [slashCommand, userContextCommand, messageContextCommand];