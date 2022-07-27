import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import Express from "express";
import { Req } from "../../API";
import Bot from "../../Bot";
import MinecraftData from "../../database/models/MinecraftData";
import MinecraftPlayer from "../../database/models/MinecraftPlayer";
import { APIFunction } from "../../types/Executors";
import { PlayerInfo, RequestContainer } from "../../types/MinecraftPaperAPI";
interface PlayerAuthArgs { player: PlayerInfo }

const fn: APIFunction = {
	name: "Auth",
	async execute(client: Bot, req: Req<RequestContainer<PlayerAuthArgs>>, res: Express.Response) {
		const mcDataRepo = client.database.source.getRepository(MinecraftData);
		const mcUserRepo = client.database.source.getRepository(MinecraftPlayer);
		const mcData = await mcDataRepo.findOne({
			where: {
				serverName: req.body.id,
			},
		});
		if (!mcData) return res.status(404).json({ body: req.body, err: true, code: 404, message: "Invalid server name!" });
		const users = mcData.players;
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

		const guild = await client.guilds.fetch(mcData.guildId)
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
		if(!user.enabled && lastIp === newIP) {
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
export default fn;