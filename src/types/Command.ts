import { CommandInteraction, ContextMenuInteraction, Message } from "discord.js";
import Bot from "../Bot";
import GuildData from "../database/models/GuildData";

interface Command {
	name: string;
	description: string;
	usage: string;
	execute(client:Bot, message:Message, args:string[], guildData?: GuildData | null): Promise<unknown>;
}
interface Interaction {
	type: string;
	name: string;
	description: string;
	category: string;
	internal_category: string;
	options: [];
	execute: (client: Bot, interaction: CommandInteraction | ContextMenuInteraction, guildData?:GuildData | null) => void;
}

export { Command, Interaction };