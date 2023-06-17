import { GeneralContent, HandlerFunction, HandlerType } from "@garycraft/orizuru";
import Bot from "../../../Bot";
import { Handler } from "../../../types/Handler";

const handler: Handler<HandlerFunction<Bot, "Chat">> = {
	type: "Chat",
	run: async (bot, data) => {
		bot.logger.info(JSON.stringify(data.body, null, 2));
		const r: GeneralContent = {
			err: false,
			code: 200,
			message: "Log Received",
			body: data.body as Express.Request
		};
		return r;
	}
}
export default handler;