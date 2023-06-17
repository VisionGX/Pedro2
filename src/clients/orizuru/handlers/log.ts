import { GeneralContent, HandlerFunction } from "@garycraft/orizuru";
import Bot from "../../../Bot";
import { Handler } from "../../../types/Handler";

const handler: Handler<HandlerFunction<Bot, "Log">> = {
	type: "Log",
	run: async (client, data) => {
		client.logger.info(JSON.stringify(data.body, null, 2));

		const r: GeneralContent = {
			body: (data.body as Express.Request),
			err: false,
			code: 200,
			message: "Received!"
		};

		return r;
	}
}
export default handler;