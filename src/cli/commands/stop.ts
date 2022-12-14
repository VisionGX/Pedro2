import { CliCommand } from "../../types/Executors";
const cmd: CliCommand = {
	name: "stop",
	description: "Stops the bot",
	usage: "stop",
	async execute(client, _args) {
		client.logger.info("Stopping Bot...");
		client.destroy();
		await client.database.source.destroy();
		process.exit(0);
	}
};
export default cmd;