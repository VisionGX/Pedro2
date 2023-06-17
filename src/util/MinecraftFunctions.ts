import MinecraftServer from "../database/models/MinecraftServer";
import MinecraftPlayer from "../database/models/MinecraftPlayer";
import { Repository } from "typeorm";
import MinecraftData from "../database/models/MinecraftData";
import Bot from "../Bot";

const createBaseMinecraftUser = async (discordId: string, invitedBy_Id?: string, repo?: Repository<MinecraftPlayer>): Promise<MinecraftPlayer> => {
	const newUser = new MinecraftPlayer();
	newUser.enabled = false;
	newUser.discordUserId = discordId;

	if (invitedBy_Id && !repo) throw new Error("Repository is required if invitedBy_Id is provided.");
	if (repo && invitedBy_Id) {
		const invitedByUser = await repo.findOne({
			where: {
				discordUserId: invitedBy_Id
			}
		});
		if (!invitedByUser) throw new Error("InvitedBy user not found.");
		newUser.invitedBy = invitedByUser.discordUserId;
	}

	newUser.lastIp = undefined;
	newUser.username = undefined;
	newUser.uuid = undefined;
	
	return newUser;
};

const createBaseMinecraftServer = async (name: string, identifier: string, data:MinecraftData): Promise<MinecraftServer> => {
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

export { createBaseMinecraftUser, createBaseMinecraftServer, hasMemberPermission };