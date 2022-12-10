import { Message, MessageEmbed } from "discord.js";
import Bot from "../../Bot";

export default {
	name: "ping",
	description: "Ping the bot",
	usage: "ping",
	// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
	execute(client: Bot, message: Message, args: string[]) {
		message.reply({embeds: [
			new MessageEmbed()
				.setTitle("Ready!")
				.setDescription(`The Ping is: ${client.ws.ping}ms`)
				.setColor(`#${client.config.defaultEmbedColor}`)
		]});
	}
};