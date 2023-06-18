import Bot from "@src/Bot";
import { AuthContent, HandlerFunction } from "@garycraft/orizuru";
import { Handler } from "@src/types/Handler";
import MinecraftPlayer from "../../../database/models/MinecraftPlayer";
import MinecraftServer from "../../../database/models/MinecraftServer";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { hasMemberPermission } from "../../../util/MinecraftFunctions";

const handler: Handler<HandlerFunction<Bot, "Auth">> = {
	type: "Auth",
	run: async (client, data) => {
		const mcPlayerRepo = client.database.source.getRepository(MinecraftPlayer);
		const mcPlayer = await mcPlayerRepo.findOne({
			where: {
				uuid: data.body.args.player.uuid,
			},
		}) || await mcPlayerRepo.findOne({
			where: {
				username: data.body.args.player.name,
			},
		});

		if (!mcPlayer) {
			const r: AuthContent = {
				body: {
					player: {
						name: data.body.args.player.name,
						uuid: data.body.args.player.uuid,
						ip: data.body.args.player.ip,
					},
					name: "Unknown",
					identifier: data.body.id,
				}, err: false, code: 404
			};
			return r;
		}

		if (!mcPlayer.uuid) {
			await mcPlayerRepo.update(mcPlayer.id, {
				uuid: data.body.args.player.uuid,
			});
		}

		const discordUser = client.users.cache.get(mcPlayer.discordUserId) || await client.users.fetch(mcPlayer.discordUserId).catch(() => null);
		if (!discordUser) {
			const r: AuthContent = {
				body: {
					player: {
						name: data.body.args.player.name,
						uuid: data.body.args.player.uuid,
						ip: data.body.args.player.ip,
					},
					name: "Unknown",
					identifier: mcPlayer.discordUserId,
				}, err: false, code: 404
			};
			return r;
		}

		const mcServerRepo = client.database.source.getRepository(MinecraftServer);
		const mcServer = await mcServerRepo.findOne({
			where: {
				identifier: data.body.id,
			},
		});

		if (!mcServer) {
			const r: AuthContent = {
				body: {
					player: {
						name: data.body.args.player.name,
						uuid: data.body.args.player.uuid,
						ip: data.body.args.player.ip,
					},
					name: discordUser.username,
					identifier: mcPlayer.discordUserId,
				}, err: false, code: 404
			};
			return r;
		}
		const discordGuild = client.guilds.cache.get(mcServer.data.guildId) || await client.guilds.fetch(mcServer.data.guildId).catch(() => null);
		if (!discordGuild) {
			const r: AuthContent = {
				body: {
					player: {
						name: data.body.args.player.name,
						uuid: data.body.args.player.uuid,
						ip: data.body.args.player.ip,
					},
					name: discordUser.username,
					identifier: mcPlayer.discordUserId,
				}, err: false, code: 404
			};
			return r;
		}
		const userMember = discordGuild.members.cache.get(discordUser.id) || await discordGuild.members.fetch(discordUser.id).catch(() => null);
		if (!userMember) {
			const r: AuthContent = {
				body: {
					player: {
						name: data.body.args.player.name,
						uuid: data.body.args.player.uuid,
						ip: data.body.args.player.ip,
					},
					name: discordUser.username,
					identifier: mcPlayer.discordUserId,
				}, err: false, code: 404
			};
			return r;
		}
		// Let's check if the user has the role or if they have been invited by someone who has the role
		const canJoin = await hasMemberPermission(client, mcServer.data.guildId, discordUser.id, mcServer);
		if (!canJoin && !mcPlayer.invitedBy) {
			// console.log("No permission and not invited by anyone");
			const r: AuthContent = {
				body: {
					player: {
						name: data.body.args.player.name,
						uuid: data.body.args.player.uuid,
						ip: data.body.args.player.ip,
					},
					name: discordUser.username,
					identifier: mcPlayer.discordUserId,
				}, err: false, code: 403
			};
			return r;
		} else if (mcPlayer.invitedBy) {
			// console.log("Invited by", mcPlayer.invitedBy);
			const inviter = await mcPlayerRepo.findOne({
				where: {
					discordUserId: mcPlayer.invitedBy,
				},
			});
			if (!inviter) {
				return {
					body: {
						player: {
							name: data.body.args.player.name,
							uuid: data.body.args.player.uuid,
							ip: data.body.args.player.ip,
						},
						name: discordUser.username,
						identifier: mcPlayer.discordUserId,
					}, err: false, code: 404
				};
			}
			const inviterMember = discordGuild.members.cache.get(inviter.discordUserId) || await discordGuild.members.fetch(inviter.discordUserId).catch(() => null);
			if (!inviterMember) {
				return {
					body: {
						player: {
							name: data.body.args.player.name,
							uuid: data.body.args.player.uuid,
							ip: data.body.args.player.ip,
						},
						name: discordUser.username,
						identifier: mcPlayer.discordUserId,
					}, err: false, code: 404
				};
			}
			if (!await hasMemberPermission(client, mcServer.data.guildId, inviterMember.id, mcServer)) {
				// console.log("Inviter has no permission");
				return {
					body: {
						player: {
							name: data.body.args.player.name,
							uuid: data.body.args.player.uuid,
							ip: data.body.args.player.ip,
						},
						name: discordUser.username,
						identifier: mcPlayer.discordUserId,
					}, err: false, code: 403
				};
			}
		}
		// Now we verify Ip matching to prevent people using other people's accounts
		if (mcPlayer.lastIp !== data.body.args.player.ip) {
			await mcPlayerRepo.update(mcPlayer.id, {
				lastIp: data.body.args.player.ip,
				enabled: false,
			});
			const embed = new EmbedBuilder()
				.setTitle("Login Attempt from new IP!")
				.setDescription(`Have you logged in from a new IP? If so, please click the button below.`)
				.setTimestamp(new Date())
				.setColor(`#${client.config.defaultEmbedColor}`)
			const actionRow = new ActionRowBuilder<ButtonBuilder>()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(`mcAuth|${mcPlayer.discordUserId}`)
						.setLabel("Verify")
						.setStyle(ButtonStyle.Success)
						.setEmoji("✅")
				)
			await userMember.send({
				embeds: [embed],
				components: [
					actionRow,
				],
			});

			const r: AuthContent = {
				body: {
					player: {
						name: data.body.args.player.name,
						uuid: data.body.args.player.uuid,
						ip: data.body.args.player.ip,
					},
					name: discordUser.username,
					identifier: mcPlayer.discordUserId,
				}, err: false, code: 403
			};
			return r;
		}
		// We also verify if the user was previously disabled
		if (!mcPlayer.enabled) {
			//console.log("Not enabled");
			const embed = new EmbedBuilder()
				.setTitle("Login Attempt Denied!")
				.setDescription(`An attempt to login to your minecraft account was denied`)
				.setTimestamp(new Date())
				.setColor(`#${client.config.defaultEmbedColor}`)
			await userMember.send({
				embeds: [embed],
			});
			const r: AuthContent = {
				body: {
					player: {
						name: data.body.args.player.name,
						uuid: data.body.args.player.uuid,
						ip: data.body.args.player.ip,
					},
					name: discordUser.username,
					identifier: mcPlayer.discordUserId,
				}, err: false, code: 403
			};
			return r;
		}

		const successEmbed = new EmbedBuilder()
			.setTitle("Minecraft Authentication!")
			.setDescription("You have Logged in to the Minecraft")
			.setColor(`#${client.config.defaultEmbedColor}`);
		userMember.send({
			embeds: [successEmbed],
		}).catch(() => null);

		const r: AuthContent = {
			body: {
				player: {
					name: data.body.args.player.name,
					uuid: data.body.args.player.uuid,
					ip: data.body.args.player.ip,
				},
				name: discordUser.username,
				identifier: mcPlayer.discordUserId,
			}, err: false, code: 200
		};
		return r;
	},
};

export default handler;