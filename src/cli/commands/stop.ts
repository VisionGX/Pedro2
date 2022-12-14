import { setTimeout } from "timers/promises";
import { CliCommand } from "../../types/Executors";
const cmd: CliCommand = {
	name: "stop",
	description: "Stops the bot",
	usage: "stop",
	async execute(client, args) {
		if(args.length > 0){
			await setTimeout(parseInt(args[0]) * 1000);
		}
		client.logger.info("Stopping Bot...");
		client.destroy();
		await client.database.source.destroy();
		process.exit(0);
	}
};
export default cmd;