import { ApplicationCommandType, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import Bot from "../../Bot";
import { Interaction } from "../../types/Executors";
const interaction:Interaction = {
	name: "ping",
	type: ApplicationCommandType.ChatInput,
	description: "Checks the bot's ping",
	category: "other",
	internal_category: "app",
	async execute(client:Bot, interaction:ChatInputCommandInteraction) {
		interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Pong!")
					.setDescription(`The ping is: ${client.ws.ping}ms`)
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});
	}
};
export default interaction;