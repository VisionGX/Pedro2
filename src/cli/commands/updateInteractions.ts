import { CliCommand } from "../../types/Executors";
const cmd: CliCommand = {
	name: "update-interactions",
	description: "Updates all interactions",
	usage: "update-interactions <guildId>",
	async execute(client, args) {
		const guildId = args[0];
		if (!guildId) {
			client.logger.info("Updating all interactions");
			client.emit("updateInteractions");
			for await (const [, guild] of client.guilds.cache) {
				client.emit("updateInteractions", {guild});
			}
		} else {
			client.logger.info(`Updating interactions for guild ${guildId}`);
			const guild = client.guilds.cache.get(guildId);
			if (!guild) {
				client.logger.error("Guild not found");
				return;
			}
			client.emit("updateInteractions", {guild});
		}
	}
};
export default cmd;