import { Message, MessageEmbed } from "discord.js";
import { Permissions } from "discord.js";
import Bot from "../../Bot";

export default {
	name: "test",
	aliases: [],
	category: "dev",
	description: "test the bot!",
	utilization: "{prefix}test",
	async execute(client: Bot, message: Message): Promise<void> {
		if(!message.member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR) && !(client.config.admins.includes(message.member?.id as string))) return;
		message.reply({embeds: [
			new MessageEmbed()
				.setTitle("Ready!")
				.setDescription(`Ping: ${client.ws.ping}ms`)
				.setColor(`#${client.config.defaultEmbedColor}`)
		]});
		client.emit("updateInteractions");
		client.emit("updateInteractions", message.guild);
	},
};