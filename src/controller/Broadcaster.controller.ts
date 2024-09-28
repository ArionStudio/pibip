import { Db } from "mongodb";
import BroadcasterModel, { Broadcaster } from "../model/Broadcaster.model";
import {
	AccessToken,
	exchangeCode,
	RefreshingAuthProvider,
} from "@twurple/auth";
import FollowersModel from "../model/Followers.model";
import { ApiClient } from "@twurple/api";
import { EventSubWsListener } from "@twurple/eventsub-ws";
import { WebSocketController } from "./Websocket.controller";


// Twitch event we handle via websocket
const scopes: string[] = [
	"moderator:read:followers",
	"channel:read:ads",
	"user:bot",
	"user:read:chat",
	"channel:bot",
	"channel:read:subscriptions",
	"bits:read",
	"channel:read:redemptions",
	"channel:read:polls",
	"channel:read:predictions",
	"channel:read:goals",
	"channel:read:hype_train",
];

export default class BroadcasterController {

	// Get all users from db and inti them
	static async initAll(db: Db, clientId: string, clientSecret: string) {

		// get users (boradcasters) from db
		const broadcasterDb = new BroadcasterModel(db);
		const all = await broadcasterDb.getAll();

		// Create auth provider to connect with twitch api 
		const authProvider = new RefreshingAuthProvider({
			clientId,
			clientSecret,
		});
		// Create on refresh twitch api auth action
		authProvider.onRefresh(
			async (userId: string, broadcaster: AccessToken) => {
				await broadcasterDb.update(userId, broadcaster);
			}
		);

		// Add users to auth provider
		await Promise.all(
			all.map((broadcaster) => {
				authProvider.addUser(broadcaster.userId, broadcaster);
			})
		);

		// Init api client for websocket listener
		const apiClient = new ApiClient({
			authProvider,
		});
		// Create event sub litsterner (via websocket)
		const listener = new EventSubWsListener({
			apiClient,
		});
		// Connect to websocket
		listener.start();

		// Create db connection with followers model
		const followersDb = new FollowersModel(db);
		
		// Go through all users and init websocket listeners for them on all neden action
		await Promise.all(
			all.map((broadcaster) => {
				WebSocketController.init(
					listener,
					apiClient,
					followersDb,
					broadcaster
				);
			})
		);

		// Return authprovider apiclient and websocket for later use
		return { authProvider, apiClient, listener };
	}

	// Init single which is added to our db after its up
	static async init(
		db: Db,
		listener: EventSubWsListener,
		apiClient: ApiClient,
		authProvider: RefreshingAuthProvider,
		broadcaster: Broadcaster,
		clientId: string,
		clientSecret: string,
		code: string
	) {
		// FIRST WE NEED SPECIFY LINK WITCH IS IN OUR TWITCH DEV PAGE
		const redirectUri = "http://localhost"; 
		
		//WE CREATE tokens by exchenge it for client secret code (we can get it via browser auth)
		const tokenData = await exchangeCode(
			clientId,
			clientSecret,
			code,
			redirectUri
		);

		// Adding him to our db 
		const broadcasterDb = new BroadcasterModel(db);
		broadcasterDb.add(broadcaster);

		// ADDING NEW USER
		authProvider.addUser(broadcaster.userId, broadcaster);

		// INIT USER Websocet listeners
		const followersDb = new FollowersModel(db);
		WebSocketController.init(listener, apiClient, followersDb, broadcaster);

		//TODO: recover all followers and other actions
	}
}
