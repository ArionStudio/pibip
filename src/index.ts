import * as dotenv from "dotenv";
import { ApiClient } from "@twurple/api";
import { exchangeCode } from "@twurple/auth";
import { MongoModel } from "./model/Mongo.model";
import { Broadcaster } from "./model/Broadcaster.model";
import { WebSocketController } from "./controller/websocket.controller";
import BroadcasterController from "./controller/Broadcaster.controller";

dotenv.config();

const clientId = process.env.client_id ?? "";
const clientSecret = process.env.client_secret ?? "";
const code = process.env.code ?? "";

async function App() {
	const db = MongoModel.getInstance();
	const conection = await db.connect();

	const {authProvider, apiClient} = await BroadcasterController.initAll(
		conection,
		clientId,
		clientSecret
	);

	

	
}
App();

async function GetToken(broadcasterId: string) {
	const redirectUri = "http://localhost"; // must match one of the URLs in the dev console exactly
	const tokenData = await exchangeCode(
		clientId,
		clientSecret,
		code,
		redirectUri
	);

	AuthController.init({ ...tokenData, userId: broadcasterId });
}

// GetToken();
