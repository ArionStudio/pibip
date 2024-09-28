import * as dotenv from "dotenv";
import { MongoModel } from "./model/Mongo.model";
import BroadcasterController from "./controller/Broadcaster.controller";
import WebSocketServer from "./controller/WebSocketServer.controller";
dotenv.config();

const clientId = process.env.client_id ?? "";
const clientSecret = process.env.client_secret ?? "";
const code = process.env.code ?? "";

// MAIN FUNCTION
async function App() {

	// DB INIT
	const db = MongoModel.getInstance();
	const conection = await db.connect();

	// WEB SOCKET SERVER INIT 
	const webSocketServer = WebSocketServer.getInstance();
	const io = webSocketServer.init(8000);

	// CONNTECTING ALL USERS TO TWITCH WEBSOCET
	const { authProvider, apiClient, listener } =
		await BroadcasterController.initAll(conection, clientId, clientSecret);
}
App();
