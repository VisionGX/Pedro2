import { CommandInteraction, MessageEmbed } from "discord.js";
import Bot from "../../../Bot";
import MinecraftData from "../../../database/models/MinecraftData";
import MinecraftPlayer from "../../../database/models/MinecraftPlayer";
import { Interaction } from "../../../types/Executors";

const interaction: Interaction = {
	name: "mc users add",
	type: "SUB_FUNCTION",
	description: "Add a Minecraft User to the registry.",
	category: "config",
	internal_category: "sub",
	async execute(client: Bot, interaction: CommandInteraction) {
		const discord_user = interaction.options.getUser("discord_user");
		const username = interaction.options.getString("username");

		if(!discord_user) {
			interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor(`#${client.config.defaultEmbedColor}`)
						.setDescription("You must provide a discord user."),
				],
			});
			return;
		}
		if(!username) {
			interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor(`#${client.config.defaultEmbedColor}`)
						.setDescription("You must provide a username."),
				],
			});
			return;
		}
		const mcDataRepo = client.database.source.getRepository(MinecraftData);
		const mcData= await mcDataRepo.findOne({ where: { guildId: `${interaction.guildId}` } });
		if(!mcData) {
			interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor(`#${client.config.defaultEmbedColor}`)
						.setDescription("You must enable Minecraft Data first."),
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
		if (mcUser) {
			interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor(`#${client.config.defaultEmbedColor}`)
						.setTitle("User already exists.")
						.setDescription(
							`${discord_user} is already registered to Minecraft. \nAs ${mcUser.name}`
						),
				],
			});
			return;
		}
		await mcUserRepo.save({
			userId: discord_user.id,
			name: username,
			data: mcData,
		});
		interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor(`#${client.config.defaultEmbedColor}`)
					.setTitle("User added.")
					.setDescription(
						`${discord_user} has been added to Minecraft as ${username}.`
					),
			],
		});	
	}
};
export default interaction;