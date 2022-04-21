import { Message } from "discord.js";
import Bot from "../../Bot";

export default {
	name: "ping",
	description: "Ping the bot",
	usage: "ping",
	execute(client: Bot, message: Message, args: string[]) {
		return message.channel.send("Pong!");
	}
};