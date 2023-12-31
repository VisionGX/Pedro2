import findRecursive from "@spaceproject/findrecursive";
import express from "express";
import Express from "express";
import Bot from "./Bot";
import { ServerRequest } from "./types/API";
export interface Req<T> extends Express.Request {
	body: T
}
import cookieParser from "cookie-parser";
class API {
	client: Bot;
	server: Express.Application;
	constructor(client: Bot) {
		this.client = client;
		this.server = Express();

		// this will parse Content-Type: application/json
		this.server.use(express.json());
		// this will parse Content-Type:  application/x-www-form-urlencoded
		this.server.use(express.urlencoded({ extended: true }));

		this.server.use(cookieParser());

		// Set the X-Powered-By header to SpaceProjectAPI
		this.server.use((req, res, next) => {
			res.setHeader("X-Powered-By", "SpaceProjectAPI");
			next();
		});
		// Add the app to the request object
		this.server.use((req, _res, next) => {
			(req as unknown as ServerRequest).parentApp = client;
			next();
		});
		// DEBUG: Log all requests
		/* this.server.use((req, _res, next) => {
			console.log(`${req.method} ${req.path}`);
			console.log(req.body);
			next();
		}); */

		this.server.get("/", function (req, res) {
			return res.send("This is an SpaceProject based API");
		});

		this.registerRoutes();

		this.server.listen(client.config.api.port, () => {
			client.logger.info(`API is listening on port ${client.config.api.port}`);
		});
	}
	private async registerRoutes() {
		// Load files recursively from the routes directory
		const globalDirName = `${__dirname}/routes`.replace(/\\/g, "/");
		const fileRoutes = await findRecursive(globalDirName);

		for(const [file,dir] of fileRoutes) {
			if (!file.endsWith(".js")) continue;
			if (file.endsWith(".map")) continue;
			const { default: route } = await import(`${dir}/${file}`);
			const serverRoute = `${dir.replace(globalDirName, "")}/${file.split(".")[0]}`.replace(/\$/g, ":");
			this.client.logger.info(`Registering route ${serverRoute}`);
			const Iroute = this.server.route(serverRoute);
			// Register the route methods
			route.get ? Iroute.get(route.get) : null;
			route.post ? Iroute.post(route.post) : null;
			route.put ? Iroute.put(route.put) : null;
			route.delete ? Iroute.delete(route.delete) : null;
			route.patch ? Iroute.patch(route.patch) : null;
		}

		// Register Orizuru route
		this.server.post("/orizuru", this.client.clients.orizuru.getExpressHandler());


		// Register html, css, and js files
		this.server.use(express.static(`${__dirname}/../src/public`));
		this.server.get("*", (_req, res) => {
			res.status(404).send("Not found.");
		});
		this.client.logger.info(`Registered ${fileRoutes.length} routes`);
	}
}
export default API;