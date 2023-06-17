import MinecraftPlayer from "../../database/models/MinecraftPlayer";
import { ServerRequest } from "@src/types/API";
import { createBaseMinecraftUser } from "../../util/MinecraftFunctions";
import axios from "axios";
import { randomUUID } from "crypto";
import { Response } from "express";

export default {
	async get(req: ServerRequest, res: Response) {
		const { query } = req;
		if (!query || !query.code) {
			return res.status(400).send("No code provided");
		}
		const { code } = query;

		const API_BASE_URL = req.parentApp.options.rest?.api;
		const VERSION = req.parentApp.options.rest?.version;
		const API_URL = `${API_BASE_URL}/v${VERSION}`;

		if (!API_BASE_URL || !VERSION) {
			return res.status(500).send("No API URL or version provided");
		}

		const CLIENT_ID = req.parentApp.application?.id;
		const CLIENT_SECRET = req.parentApp.config.client_secret;
		const BASE_URL = `https://${req.hostname}`;
		const REDIRECT_URI = BASE_URL + "/minecraft/oauthcallback";

		const rdata = `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=authorization_code&code=${code}&redirect_uri=${REDIRECT_URI}`;

		const headers = {
			"Content-Type": "application/x-www-form-urlencoded",
			"Accept-Encoding": "*",
		};
		const response = await axios.post(`${API_URL}/oauth2/token`, encodeURI(rdata), {
			headers: headers
		}).catch(err => {
			req.parentApp.logger.error(`Error getting token, Errored soliciting token, code: ${err.code}, message: ${err.message}`);
			//req.parentApp.logger.error(err);
			return null;
		});

		if (!response || !response.data) {
			return res.status(500).send("Error getting token, No response data provided");
		}
		const { data } = response;
		if (!data.access_token || !data.refresh_token) {
			return res.status(500).send("No access token or refresh token provided");
		}


		const { access_token, refresh_token, expires_in } = data;

		const response2 = await axios.get(`${API_URL}/oauth2/@me`, {
			headers: {
				Authorization: `Bearer ${access_token}`,
				"Accept-Encoding": "*",
			},
		}).catch(err => {
			req.parentApp.logger.error(`Error getting user data, Errored getting user data`);
			//req.parentApp.logger.error(err);
		});
		if (!response2 || !response2.data) {
			return res.status(500).send("Error getting user data, No response data provided");
		}
		const { data: r2data } = response2;
		const userData = r2data.user;
		if (!userData.id) {
			return res.status(500).send("No user id provided");
		}
		const mcUserRepo = req.parentApp.database.source.getRepository(MinecraftPlayer);

		
		const mcUser = await mcUserRepo.findOne({
			where: {
				discordUserId: userData.id
			}
		}) || await createBaseMinecraftUser(userData.id);
		
		const uuid = randomUUID();
		mcUser.sessionCookie = uuid;

		await mcUserRepo.save(mcUser);
		return res.cookie("session", uuid, { maxAge: 900000, httpOnly: true }).redirect(BASE_URL + "/minecraftjoining.html");
	},
}