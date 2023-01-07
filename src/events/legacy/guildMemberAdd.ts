import { GuildMember } from "discord.js";
import Bot from "../../Bot";

export default async (client: Bot,member:GuildMember) => {
	client.emit("welcome",{member});
};