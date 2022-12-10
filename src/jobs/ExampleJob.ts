import Bot from "../Bot";
import { Job } from "../types/Executors";

const job: Job = {
	name: "ExampleJob",
	cronInterval: "0 0 0 1 *",
	task: async (client: Bot) => {
		client.logger.info("This is a test job.");
	}
};
export default job;