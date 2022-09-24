import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import { Response } from "express";
import { Req } from "../API";
import Bot from "../Bot";
import MinecraftData from "../database/models/MinecraftData";
import MinecraftPlayer from "../database/models/MinecraftPlayer";
import MinecraftServer from "../database/models/MinecraftServer";
import { ServerRequest } from "../types/API";
import { EventInfo, PlayerInfo, RequestContainer, ServerInfo, ServerPlayerStats } from "../types/MinecraftPaperAPI";
export default {
	async post(req: ServerRequest, res: Response) {
		const { parentApp: client } = req;
		if (!req.headers.authorization) {
			return res.status(403).json({ body: req.body, err: true, code: 403, message: "Invalid password!" });
		}
		if (req.headers.authorization !== `${client.config.api.password}`) return res.status(403).json({ body: req.body, err: true, code: 403, message: "Invalid password!" });

		const { content_type } = req.body;
		const fn = functions[content_type];
		if (!fn) return res.status(404).json({ body: req.body, err: true, code: 404, message: "Invalid content type!" });
		try {
			fn(client, req, res);
		} catch (e) {
			client.logger.error("Error while executing POST API function!", e);
		}
	},
};
interface PlayerAuthArgs { player: PlayerInfo }
interface PlayerJoinArgs { player: PlayerInfo, server: ServerPlayerStats, event: EventInfo }
interface PlayerLeaveArgs { player: PlayerInfo, server: ServerPlayerStats, event: EventInfo }

const functions: { [key: string]: (client: Bot, req: ServerRequest, res: Response) => Promise<unknown> } = {
	// PlayerJoin Handler
	async PlayerJoin(client: Bot, req: Req<RequestContainer<PlayerJoinArgs>>, res: Response) {
		const mcServerRepo = client.database.source.getRepository(MinecraftServer);
		const mcServer = await mcServerRepo.findOne({
			where: {
				identifier: req.body.id,
			},
			relations: ["data"],
		});
		if (!mcServer) return res.status(404).json({ body: req.body, err: true, code: 404, message: "Invalid server name!" });
		if (!mcServer.data.log || !mcServer.data.log.enabled) return;

		const channel = await client.channels.fetch(`${mcServer.data.log.channelId}`);
		if (!channel || !channel.isText()) return;

		const { args, content } = req.body;
		const fields = [];
		for await (const [k, v] of Object.entries(args)) {
			fields.push({ name: k, value: `${v.length >= 1 ? v : "Empty"}` });
		}
		const embed = new MessageEmbed()
			.setTitle("Minecraft Logging")
			.setColor(`#${client.config.defaultEmbedColor}`)
			.setDescription(`${content}`)
			.addFields([
				{ name: "Player", value: `${args.player.name}`, inline: true },
				{ name: "UUID", value: `${args.player.uuid}`, inline: true },
				/* { name: "Address", value: `${args.player.ip}` } */
			])
			.setTimestamp(new Date());


		await channel.send({
			embeds: [embed],
		});
		res.status(200).json({ body: req.body, err: false, code: 200, message: "Received!" });
	},
	// PlayerLeave Handler
	async PlayerLeave(client: Bot, req: Req<RequestContainer<PlayerLeaveArgs>>, res: Response) {
		const mcServerRepo = client.database.source.getRepository(MinecraftServer);
		const mcServer = await mcServerRepo.findOne({
			where: {
				identifier: req.body.id,
			},
			relations: ["data"],
		});
		if (!mcServer) return res.status(404).json({ body: req.body, err: true, code: 404, message: "Invalid server name!" });
		if (!mcServer.data.log || !mcServer.data.log.enabled) return;

		const channel = await client.channels.fetch(`${mcServer.data.log.channelId}`);
		if (!channel || !channel.isText()) return;

		const { args, content } = req.body;
		const fields = [];
		for await (const [k, v] of Object.entries(args)) {
			fields.push({ name: k, value: `${v.length >= 1 ? v : "Empty"}` });
		}
		const embed = new MessageEmbed()
			.setTitle("Minecraft Logging")
			.setColor(`#${client.config.defaultEmbedColor}`)
			.setDescription(`${content}`)
			.addFields([
				{ name: "Player", value: `${args.player.name}`, inline: true },
				{ name: "UUID", value: `${args.player.uuid}`, inline: true },
				/* { name: "Address", value: `${args.player.ip}` } */
			])
			.setTimestamp(new Date());


		await channel.send({
			embeds: [embed],
		});
		res.status(200).json({ body: req.body, err: false, code: 200, message: "Received!" });
	},
	// Log Handler
	async Log(client: Bot, req: Req<RequestContainer<ServerInfo>>, res: Response) {
		const mcServerRepo = client.database.source.getRepository(MinecraftServer);
		const mcServer = await mcServerRepo.findOne({
			where: {
				identifier: req.body.id,
			},
			relations: ["data"],
		});
		if (!mcServer) return res.status(404).json({ body: req.body, err: true, code: 404, message: "Invalid server name!" });
		if (!mcServer.data.log || !mcServer.data.log.enabled) return;

		const channel = await client.channels.fetch(`${mcServer.data.log.channelId}`);
		if (!channel || !channel.isText()) return;

		const { args, content } = req.body;
		const fields = [];
		for await (const [k, v] of Object.entries(args)) {
			fields.push({ name: k, value: `${v.length >= 1 ? v : "Empty"}` });
		}
		const embed = new MessageEmbed()
			.setTitle("Minecraft Logging")
			.setDescription(`${content}`)
			.setColor(`#${client.config.defaultEmbedColor}`)
			.setFields(fields)
			.setTimestamp(new Date());

		await channel.send({
			embeds: [embed],
		});
		res.status(200).json({ body: req.body, err: false, code: 200, message: "Received!" });
	},
	// Chat handler
	async Chat(_client: Bot, req: Req<RequestContainer<ServerInfo>>, res: Response) {
		res.status(200).json({ body: req.body, err: false, code: 200, message: "Received!" });
	},
	// Auth handler
	async Auth(client: Bot, req: Req<RequestContainer<PlayerAuthArgs>>, res: Response) {
		const mcServerRepo = client.database.source.getRepository(MinecraftServer);
		const mcUserRepo = client.database.source.getRepository(MinecraftPlayer);
		const mcServer = await mcServerRepo.findOne({
			where: {
				identifier: req.body.id,
			},
			relations: ["data"],
		});
		if (!mcServer) return res.status(404).json({ body: req.body, err: true, code: 404, message: "Invalid server name!" });
		const users = mcServer.players;
		const user = users.find(p => p.name === req.body.args.player.name);
		if (!user) return res.status(404).json({ body: req.body, err: true, code: 404, message: "User not found!" });
		if (user.uuid && user.uuid !== req.body.args.player.uuid) return res.status(404).json({ body: req.body, err: true, code: 404, message: "User not found!" });
		const lastIp = user.lastIp;
		// Received IP comes in the format /IP:PORT , remove the / , : and PORT 
		const newIP = req.body.args.player.ip.split(":")[0].replace("/", "");
		user.uuid = req.body.args.player.uuid;
		user.lastIp = newIP;
		user.enabled = lastIp === newIP;
		await mcUserRepo.save(user);

		const guild = await client.guilds.fetch(mcServer.data.guildId)
			.catch(() => null);
		if (!guild) return res.status(404).json({ body: req.body, err: true, code: 404, message: "Guild not found!" });
		const member = await guild.members.fetch(user.userId)
			.catch(() => null);
		if (!member) return res.status(404).json({ body: req.body, err: true, code: 404, message: "Member not found!" });

		if (lastIp !== newIP) {
			await member.send({
				embeds: [
					new MessageEmbed()
						.setColor(`#${client.config.defaultEmbedColor}`)
						.setTitle("Minecraft Authentication")
						.setDescription("Login attempt from a new IP!\nYou'll have to authorize your new device or location.\nIf you are not trying to login from a new device, please contact an admin and DO NOT CLICK *Authorize*.")
						.addField("Server:", `${guild.name}`),
				],
				components: [
					new MessageActionRow()
						.addComponents([
							new MessageButton()
								.setLabel("Authorize")
								.setStyle("SUCCESS")
								.setCustomId(`mcAuth|${user.uuid}`),
						]),
				]
			}).catch(() => null);
			return res.status(401).json({ body: req.body, err: false, code: 401, message: "IP has changed!" });
		}
		if (!user.enabled && lastIp === newIP) {
			await member.send({
				embeds: [
					new MessageEmbed()
						.setColor(`#${client.config.defaultEmbedColor}`)
						.setTitle("Minecraft Authentication")
						.setDescription("You have just tried to login, but the request was denied.")
						.addField("Server:", `${guild.name}`),
				],
			}).catch(() => null);
			return res.status(401).json({ body: req.body, err: false, code: 401, message: "User is not enabled!" });
		}
		await member.send({
			embeds: [
				new MessageEmbed()
					.setColor(`#${client.config.defaultEmbedColor}`)
					.setTitle("Minecraft Authentication")
					.setDescription("You have just logged in to Minecraft!")
					.addField("Server:", `${guild.name}`),
			],
		}).catch(() => null);
		const responseBody = {
			player: {
				name: user.name,
				uuid: user.uuid,
				ip: user.lastIp,
			},
			name: member.user.tag,
			identifier: user.userId,
		};
		res.status(200).json({ body: responseBody, err: false, code: 200, message: "User authenticated!" });
	}
};