import { GeneralContent, HandlerFunction, HandlerType } from "@garycraft/orizuru";
import Bot from "../../../Bot";
import { Handler } from "../../../types/Handler";

const handler: Handler<HandlerFunction<Bot, "Chat">> = {
	type: "Chat",
	run: async (client, data) => {
		const r: GeneralContent = {
			err: false,
			code: 200,
			message: "Chat Received",
			body: data.body as Express.Request
		};
		return r;
	}
}
export default handler;