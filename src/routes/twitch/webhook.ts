import { ServerRequest } from "../../types/API";
import { Response } from "express";

const TWITCH_CHALLENGE_MESSAGE_TYPE = "webhook_callback_verification";
const TWITCH_NOTIFICATION_MESSAGE_TYPE = "notification";
const TWITCH_ALLOWED_MESSAGE_TYPES = ["stream.online"];

export default {
	async get(_req: ServerRequest, res: Response) {
		res.status(404).json({ err: true, code: 404, message: "Not found!" });
	},
	async post(req: ServerRequest, res: Response) {
		if(!req.headers["twitch-eventsub-message-type"]) return res.status(400).json({ err: true, code: 400, message: "Bad Request!" });
		if(req.headers["twitch-eventsub-message-type"] === TWITCH_NOTIFICATION_MESSAGE_TYPE) {
			doWebhookBehavior(req, res);
		} else
		if(req.headers["twitch-eventsub-message-type"] === TWITCH_CHALLENGE_MESSAGE_TYPE) {
			doCallbackBehavior(req, res);
		}
		else {
			res.status(400).json({ err: true, code: 400, message: "Bad Request!" });
		}
	}
}
const doCallbackBehavior = async (req: ServerRequest, res: Response) => {
	if (!req.body || !req.body.challenge) return res.status(400).json({ err: true, code: 400, message: "Bad Request!" });
	if (req.body.message_type !== TWITCH_CHALLENGE_MESSAGE_TYPE) return res.status(400).json({ err: true, code: 400, message: "Bad Request!" });
	res.status(200).json({ challenge: req.body.challenge });
}
const doWebhookBehavior = async (req: ServerRequest, res: Response) => {
	if (!req.body || !req.body.subscription || !req.body.event) return res.status(400).json({ err: true, code: 400, message: "Bad Request!" });
	if (!TWITCH_ALLOWED_MESSAGE_TYPES.includes(req.body.subscription.message_type)) return res.status(400).json({ err: true, code: 400, message: "Bad Request!" });
	res.status(200).json({ error: false, code: 200, message: "Event Received!" });

	const broadcaster_uid = process.env.TWITCH_BROADCASTER_UID || "0";
	if (req.body.event.broadcaster_user_id !== broadcaster_uid) return req.parentApp.logger.warn("Received a webhook event for a different broadcaster!");

	req.parentApp.emit("twitchStreamStarted");
}