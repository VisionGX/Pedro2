import Bot from "../Bot";
import { Job } from "../types/Executors";

const job: Job = {
	name: "NoJob",
	cronInterval: "0 0 0 0 0",
	task: async (client: Bot) => {
		client.logger.info("This is no job.");
	}
};
export default job;