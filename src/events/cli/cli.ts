import Bot from "../../Bot";


export default async (client: Bot, line:string) => {
	client.logger.info(`CommandLine: ${line}`);
};