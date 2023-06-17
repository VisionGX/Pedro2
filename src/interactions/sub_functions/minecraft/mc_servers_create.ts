import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import Bot from "../../../Bot";
import { Interaction } from "../../../types/Executors";
import MinecraftData from "../../../database/models/MinecraftData";
import { createBaseMinecraftServer } from "../../../util/MinecraftFunctions";
import MinecraftServer from "../../../database/models/MinecraftServer";

const interaction: Interaction = {
	name: "mc servers create",
	type: "SubFunction",
	description: "Register a Minecraft Server.",
	category: "minecraft",
	internal_category: "sub",
	async execute(client: Bot, interaction: ChatInputCommandInteraction) {
		const serverName = interaction.options.getString("name", true);
		const identifier = interaction.options.getString("identifier", true);
		
		const mcDataRepo = client.database.source.getRepository(MinecraftData);
		const mcServerRepo = client.database.source.getRepository(MinecraftServer);
		const mcData = await mcDataRepo.findOne({ where: { guildId: interaction.guild?.id }, relations: ["servers"] });
		if(!mcData) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Not initialized")
					.setDescription("An error has ocurred, try again.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});

		const newServer = await createBaseMinecraftServer(serverName, identifier, mcData);
		mcData.servers?.push(newServer);
		await mcDataRepo.save(mcData);
		await mcServerRepo.save(newServer);
		

		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Server created")
					.setDescription(`Server ${serverName} has been created.`)
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
	}
};
export default interaction;