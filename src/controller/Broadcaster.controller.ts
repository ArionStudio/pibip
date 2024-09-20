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
	static async initAll(db: Db, clientId: string, clientSecret: string) {
		const broadcasterDb = new BroadcasterModel(db);

		const all = await broadcasterDb.getAll();
		const authProvider = new RefreshingAuthProvider({
			clientId,
			clientSecret,
		});

		authProvider.onRefresh(
			async (userId: string, broadcaster: AccessToken) => {
				await broadcasterDb.update(userId, broadcaster);
			}
		);

		const followersDb = new FollowersModel(db);

		await Promise.all(
			all.map((broadcaster) => {
				authProvider.addUser(broadcaster.userId, broadcaster);
			})
		);

		const apiClient = new ApiClient({
			authProvider,
		});

		const listener = new EventSubWsListener({
			apiClient,
		});

		listener.start();
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

		return { authProvider, apiClient, listener };
	}

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
		const redirectUri = "http://localhost"; 
		const tokenData = await exchangeCode(
			clientId,
			clientSecret,
			code,
			redirectUri
		);

		const broadcasterDb = new BroadcasterModel(db);
		broadcasterDb.add(broadcaster);

		authProvider.onRefresh(async (userId, newTokenData) => {
			await broadcasterDb.update(userId, newTokenData);
		});

		authProvider.addUser(broadcaster.userId, broadcaster);
		const followersDb = new FollowersModel(db);

		WebSocketController.init(listener, apiClient, followersDb, broadcaster);

		//TODO: recover all followers and other actions
	}
}
