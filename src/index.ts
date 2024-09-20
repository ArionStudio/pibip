import * as dotenv from "dotenv";
import { ApiClient } from "@twurple/api";
import { exchangeCode, RefreshingAuthProvider } from "@twurple/auth";
import { MongoModel } from "./model/Mongo.model";
import { Broadcaster } from "./model/Broadcaster.model";
import BroadcasterController from "./controller/Broadcaster.controller";
import { Db } from "mongodb";
import { EventSubWsListener } from "@twurple/eventsub-ws";

dotenv.config();

const clientId = process.env.client_id ?? "";
const clientSecret = process.env.client_secret ?? "";
const code = process.env.code ?? "";

async function App() {
	const db = MongoModel.getInstance();
	const conection = await db.connect();

	const { authProvider, apiClient, listener } =
		await BroadcasterController.initAll(conection, clientId, clientSecret);
}
App();
