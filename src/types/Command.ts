import { Message } from "discord.js";
import Bot from "../Bot";
import GuildData from "../database/models/GuildData";

interface Command {
	name: string;
	description: string;
	usage: string;
	execute(client:Bot, message:Message, args:string[], guildData: GuildData): Promise<unknown>;
}

export { Command }