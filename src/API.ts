import express from "express";
import Express from "express";
import Bot from "./Bot";
export interface Req<T> extends Express.Request {
	body: T
}
class API {
	server: Express.Application;
	constructor(client: Bot) {
		this.server = Express();

		// this will parse Content-Type: application/json
		this.server.use(express.json());
		// this will parse Content-Type:  application/x-www-form-urlencoded
		this.server.use(express.urlencoded({ extended: true }));

		// Set the X-Powered-By header to SpaceProjectAPI
		this.server.use((req, res, next) => {
			res.setHeader("X-Powered-By", "SpaceProjectAPI");
			next();
		});

		this.server.get("/", function (req, res) {
			if (!req.body.content_type)
				return res.send("This is an SpaceProject based API");

			if (!req.headers.authorization) {
				return res.status(403).json({ body: req.body, err: true, code: 403, message: "Invalid password!" });
			}
			if (req.headers.authorization !== `${client.config.api.password}`) return res.status(403).json({ body: req.body, err: true, code: 403, message: "Invalid password!" });

			const { content_type } = req.body;
			const fn = client.apiFunctions.get(`${content_type}`);
			if (!fn) return res.status(404).json({ body: req.body, err: true, code: 404, message: "Invalid content type!" });
			try {
				fn.execute(client, req, res);
			} catch (e) {
				client.logger.error("Error while executing GET API function!", e);
			}
		});

		this.server.post("/", (req, res) => {
			if (!req.headers.authorization) {
				return res.status(403).json({ body: req.body, err: true, code: 403, message: "Invalid password!" });
			}
			if (req.headers.authorization !== `${client.config.api.password}`) return res.status(403).json({ body: req.body, err: true, code: 403, message: "Invalid password!" });

			const { content_type } = req.body;
			const fn = client.apiFunctions.get(`${content_type}`);
			if (!fn) return res.status(404).json({ body: req.body, err: true, code: 404, message: "Invalid content type!" });
			try {
				fn.execute(client, req, res);
			} catch (e) {
				client.logger.error("Error while executing POST API function!", e);
			}
		});

		this.server.listen(client.config.api.port, () => {
			client.logger.info(`API is listening on port ${client.config.api.port}`);
		});
	}
}
export default API;