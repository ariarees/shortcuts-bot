import { Collection } from 'discord.js';
import { Command } from '../types/Command';
import * as fs from 'fs';
import * as path from 'path';

export async function loadCommands(): Promise<Collection<string, Command>> {
  const commands = new Collection<string, Command>();
  const commandsPath = path.join(__dirname, '../commands');
  
  if (!fs.existsSync(commandsPath)) {
    console.warn('Commands directory does not exist');
    return commands;
  }
  
  const commandFiles = fs.readdirSync(commandsPath).filter(file => 
    file.endsWith('.ts') || file.endsWith('.js')
  );
  
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const commandModule = await import(filePath);
    const command = commandModule.command as Command;
    
    if ('data' in command && 'execute' in command) {
      commands.set(command.data.name, command);
      console.log(`Loaded command: ${command.data.name}`);
    } else {
      console.warn(`Command at ${filePath} is missing required "data" or "execute" property`);
    }
  }
  
  return commands;
}