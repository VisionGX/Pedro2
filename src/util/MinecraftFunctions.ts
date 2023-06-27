import MinecraftServer from "../database/models/MinecraftServer";
import MinecraftPlayer from "../database/models/MinecraftPlayer";
import { Repository } from "typeorm";
import MinecraftData from "../database/models/MinecraftData";
import Bot from "../Bot";
import MinecraftStatusMessage from "../database/models/MinecraftStatusMessage";
import { TextBasedChannel } from "discord.js";

const createBaseMinecraftUser = async (discordId: string): Promise<MinecraftPlayer> => {
	const newUser = new MinecraftPlayer();
	newUser.enabled = false;
	newUser.discordUserId = discordId;

	newUser.lastIp = undefined;
	newUser.username = undefined;
	newUser.uuid = undefined;

	return newUser;
};

const createBaseMinecraftServer = async (name: string, identifier: string, data: MinecraftData): Promise<MinecraftServer> => {
	const newServer = new MinecraftServer();

	newServer.serverName = name;
	newServer.identifier = identifier;
	newServer.data = data;

	return newServer;
};

const hasMemberPermission = async (client: Bot, guildId: string, memberId: string, mcServer: MinecraftServer) => {
	const guild = client.guilds.cache.get(guildId) || await client.guilds.fetch(guildId).catch(() => null);
	if (!guild) return false;
	const member = guild.members.cache.get(memberId) || await guild.members.fetch(memberId).catch(() => null);
	if (!member) return false;
	const parsed = JSON.parse(mcServer.allowedRoleIds) as string[];
	const hasRole = member.roles.cache.some((role) => {
		return parsed.includes(role.id);
	});
	const isAdmin = member.permissions.has("Administrator") || member.permissions.has("ManageGuild") || client.config.admins.includes(member.id);
	return hasRole || isAdmin;
};

const getStatusChannel = async (client: Bot, serverIdentifier: string): Promise<TextBasedChannel | null> => {
	const statusMessageRepo = client.database.source.getRepository(MinecraftStatusMessage);
	const statusMessage = await statusMessageRepo.findOne({
		where: {
			serverIdentifier: serverIdentifier
		}
	});
	if (!statusMessage) {
		return null;
	}
	const guildId = statusMessage.guildId;
	const channelId = statusMessage.channelId;
	if (!guildId || !channelId) {
		return null;
	}
	const guild = client.guilds.cache.get(guildId) || await client.guilds.fetch(guildId).catch(() => null);
	if (!guild) {
		return null;
	}
	const channel = guild.channels.cache.get(channelId) || await guild.channels.fetch(channelId).catch(() => null);
	if (!channel || !channel.isTextBased()) {
		return null;
	}
	return channel;
}
export { createBaseMinecraftUser, createBaseMinecraftServer, hasMemberPermission, getStatusChannel };