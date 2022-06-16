import { CommandInteraction, MessageEmbed } from "discord.js";
import Bot from "../../Bot";
export default {
	name: "ping",
	type: "CHAT_INPUT",
	description: "Checks the bot's ping",
	category: "other",
	internal_category: "app",
	async execute(client:Bot, interaction:CommandInteraction) {
		interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle(`Pong!`)
					.setDescription(`The ping is: ${client.ws.ping}ms`)
					.setColor(`#${client.config.embedColor}`)
			]
		});
	}
};