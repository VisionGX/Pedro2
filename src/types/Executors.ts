import { ApplicationCommandOption, ApplicationCommandType, CommandInteraction, ContextMenuCommandInteraction, Message, ModalSubmitInteraction } from "discord.js";
import Bot from "../Bot";

interface Command {
	name: string;
	description: string;
	usage: string;
	execute(client:Bot, message:Message, args:string[]): Promise<unknown>;
}
interface Interaction {
	type: ApplicationCommandType | "SUB_FUNCTION";
	name: string;
	description: string;
	category: string;
	internal_category: "app" | "guild" | "sub";
	options?: ApplicationCommandOption[];
	execute<T = CommandInteraction>(client: Bot, interaction: T):Promise<unknown>;
	execute<T = ContextMenuCommandInteraction>(client: Bot, interaction: T):Promise<unknown>;
	execute<T = ModalSubmitInteraction>(client: Bot, interaction: T):Promise<unknown>;
}
interface Job {
	name: string;
	cronInterval: string;
	task: (client:Bot) => Promise<unknown>;
}
interface CliCommand {
	name: string;
	description: string;
	usage: string;
	execute(client:Bot, args:string[]): Promise<unknown>;
}

export { Command, Interaction, Job, CliCommand };