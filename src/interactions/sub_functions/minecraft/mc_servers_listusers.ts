import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import Bot from "../../../Bot";
import MinecraftData from "../../../database/models/MinecraftData";
import MinecraftPlayer from "../../../database/models/MinecraftPlayer";
import MinecraftServer from "../../../database/models/MinecraftServer";
import { Interaction } from "../../../types/Executors";

/* const interaction: Interaction = {
	name: "mc servers adduser",
	type: "SubFunction",
	description: "Add a user to a Minecraft Server.",
	category: "config",
	internal_category: "sub",
	async execute(client: Bot, interaction: ChatInputCommandInteraction) {
		const name = interaction.options.getString("name");
		const discord_user = interaction.options.getUser("user");

		if(!name) {
			interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor(`#${client.config.defaultEmbedColor}`)
						.setDescription("You must provide a server name."),
				],
			});
			return;
		}
		if(!discord_user) {
			interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor(`#${client.config.defaultEmbedColor}`)
						.setDescription("You must provide an user."),
				],
			});
			return;
		}
		const mcDataRepo = client.database.source.getRepository(MinecraftData);
		const mcData= await mcDataRepo.findOne({ where: { guildId: `${interaction.guildId}` } });
		if(!mcData) {
			interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor(`#${client.config.defaultEmbedColor}`)
						.setDescription("You must enable Minecraft Data first."),
				],
			});
			return;
		}
		const mcServerRepo = client.database.source.getRepository(MinecraftServer);
		const mcServer = await mcServerRepo.findOne({
			where: [
				{ serverName: name },
			]
		});
		if (!mcServer) {
			interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor(`#${client.config.defaultEmbedColor}`)
						.setTitle("Server does not exist.")
						.setDescription(
							`A server with the name ${name} does not exist.`
						),
				],
			});
			return;
		}
		const mcUserRepo = client.database.source.getRepository(MinecraftPlayer);
		const mcUser = await mcUserRepo.findOne({
			where: [
				{ userId: `${discord_user.id}` },
			]
		});
		if (!mcUser) {
			interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor(`#${client.config.defaultEmbedColor}`)
						.setTitle("User does not exist.")
						.setDescription(
							`A user with the name ${discord_user.tag} does not exist.`
						),
				],
			});
			return;
		}
		mcServer.players.push(mcUser);
		await mcServerRepo.save(mcServer);
		interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(`#${client.config.defaultEmbedColor}`)
					.setTitle("User added.")
					.setDescription(
						`The user <@${discord_user.id}> (${mcUser.name}) has been added to the server ${mcServer.serverName}.`
					),
			],
		});
	}
};
export default interaction; */

const interaction: Interaction = {
	name: "mc servers listusers",
	type: "SubFunction",
	description: "List all users of a Minecraft Server.",
	category: "config",
	internal_category: "sub",
	async execute(client: Bot, interaction: ChatInputCommandInteraction) {
		const name = interaction.options.getString("name");
		const page = interaction.options.getInteger("page") ? (interaction.options.getInteger("page")! < 1) ? 1 : interaction.options.getInteger("page")! : 1;

		if(!name) {
			interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor(`#${client.config.defaultEmbedColor}`)
						.setDescription("You must provide a server name."),
				],
			});
			return;
		}
		if(!page) {
			interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor(`#${client.config.defaultEmbedColor}`)
						.setDescription("You must provide a page."),
				],
			});
			return;
		}
		const mcDataRepo = client.database.source.getRepository(MinecraftData);
		const mcData= await mcDataRepo.findOne({ where: { guildId: `${interaction.guildId}` } });
		if(!mcData) {
			interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor(`#${client.config.defaultEmbedColor}`)
						.setDescription("You must enable Minecraft Data first."),
				],
			});
			return;
		}
		const mcServerRepo = client.database.source.getRepository(MinecraftServer);
		const mcServer = await mcServerRepo.findOne({
			where: [
				{ serverName: name },
			],
		});
		if (!mcServer) {
			interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor(`#${client.config.defaultEmbedColor}`)
						.setTitle("Server does not exist.")
						.setDescription(
							`A server with the name ${name} does not exist.`
						),
				],
			});
			return;
		}
		const users = mcServer.players!;
		const usersPerPage = 25;
		const pages = Math.ceil(users.length / usersPerPage);
		const start = (page - 1) * usersPerPage;
		const end = start + usersPerPage;
		const usersPage = users.slice(start, end);
		const embed = new EmbedBuilder()
			.setColor(`#${client.config.defaultEmbedColor}`)
			.setTitle(`Users of ${mcServer.serverName}`)
			.setDescription(
				`Page ${page}/${pages}`
			);
		for (const user of usersPage) {
			//embed.addField(user.player.name, `<@${user.player.userId}>`);
			embed.addFields({
				name: user.player.name,
				value: `<@${user.player.userId}>`,
			});
		}
		interaction.reply({
			embeds: [
				embed,
			],
		});
	}
};
export default interaction;

