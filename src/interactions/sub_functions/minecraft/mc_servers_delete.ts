import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import Bot from "../../../Bot";
import { Interaction } from "../../../types/Executors";
import { createBaseMinecraftServer } from "../../../util/MinecraftFunctions";
import MinecraftServer from "../../../database/models/MinecraftServer";

const interaction: Interaction = {
	name: "mc servers delete",
	type: "SubFunction",
	description: "Delete a registered Minecraft Server.",
	category: "minecraft",
	internal_category: "sub",
	async execute(client: Bot, interaction: ChatInputCommandInteraction) {
		const name = interaction.options.getString("name", true);

		const mcServerRepo = client.database.source.getRepository(MinecraftServer);

		const mcServer = await mcServerRepo.findOne({ where: { serverName: name } });
		if(!mcServer) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Server not found")
					.setDescription(`Server ${name} was not found.`)
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});

		await mcServerRepo.delete(mcServer.id);

		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Server deleted")
					.setDescription(`Server ${name} has been deleted.`)
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
	}
};
export default interaction;