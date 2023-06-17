import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import Bot from "../../../Bot";
import { Interaction } from "../../../types/Executors";
import MinecraftServer from "../../../database/models/MinecraftServer";

const interaction: Interaction = {
	name: "mc servers addallowedrole",
	type: "SubFunction",
	description: "Add a role to the allowed roles list.",
	category: "minecraft",
	internal_category: "sub",
	async execute(client: Bot, interaction: ChatInputCommandInteraction) {
		const name = interaction.options.getString("name", true);
		const role = interaction.options.getRole("role", true);

		const mcServerRepo = client.database.source.getRepository(MinecraftServer);
		const mcServer = await mcServerRepo.findOne({ where: { serverName: name } });
		if (!mcServer) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Server not found")
					.setDescription(`Server ${name} was not found.`)
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});

		mcServer.assignAllowedRole(role.id);
		await mcServerRepo.save(mcServer);

		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Role added")
					.setDescription(`Role ${role.name} has been added to the allowed roles list.`)
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
	}
};
export default interaction;