import { GeneralContent, HandlerFunction, HandlerType } from "@garycraft/orizuru";
import Bot from "../../../Bot";
import { Handler } from "../../../types/Handler";

const handler: Handler<HandlerFunction<Bot, "Chat">> = {
	type: "Chat",
	run: async (client, data) => {
		return {
			body: data.body,
			err: false,
			code: 200,
			message: "Chat Received"
		}
	}
}
export default handler;