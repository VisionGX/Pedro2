import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import Bot from "../../../Bot";
import MinecraftData from "../../../database/models/MinecraftData";
import MinecraftPlayer from "../../../database/models/MinecraftPlayer";
import { Interaction } from "../../../types/Executors";

const interaction: Interaction = {
	name: "mc users remove",
	type: "SubFunction",
	description: "Remove a Minecraft User from the registry.",
	category: "config",
	internal_category: "sub",
	async execute(client: Bot, interaction: ChatInputCommandInteraction) {
		const discord_user = interaction.options.getUser("discord_user");
		if(!discord_user) {
			interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor(`#${client.config.defaultEmbedColor}`)
						.setDescription("You must provide a discord user."),
				],
			});
			return;
		}
		const mcUserRepo = client.database.source.getRepository(MinecraftPlayer);
		const mcUser = await mcUserRepo.findOne({
			where: {
				userId: `${discord_user.id}`,
			},
		});
		if (!mcUser) {
			interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor(`#${client.config.defaultEmbedColor}`)
						.setTitle("User does not exist.")
						.setDescription(
							`${discord_user} is not registered to Minecraft.`
						),
				],
			});
			return;
		}
		await mcUserRepo.remove(mcUser);
		interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(`#${client.config.defaultEmbedColor}`)
					.setTitle("User removed.")
					.setDescription(
						`${discord_user} has been removed from Minecraft.`
					),
			],
		});	
	}
};
export default interaction;