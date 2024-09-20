import { ApiClient } from "@twurple/api";
import { EventSubWsListener } from "@twurple/eventsub-ws";
import {
	EventSubChannelChatMessageEvent,
	EventSubChannelFollowEvent,
	EventSubChannelSubscriptionEvent,
} from "@twurple/eventsub-base";
import FollowersModel from "../model/Followers.model";
import { Db } from "mongodb";
import { Broadcaster } from "../model/Broadcaster.model";

export class WebSocketController {
	static init(
		listener: EventSubWsListener,
		apiClient: ApiClient,
		followersDb: FollowersModel,
		broadcaster: Broadcaster
	): void {
		const broadcasterId = broadcaster.userId;
		listener.onChannelFollow(
			broadcasterId,
			broadcasterId,
			async (event: EventSubChannelFollowEvent) => {
				if (
					(await followersDb.findIn(
						event.userId,
						event.broadcasterId
					)) === null
				) {
					const date = new Date();
					await followersDb.add({
						userId: event.userId,
						broadcasterId: event.broadcasterId,
						firstFollow: date.toISOString(),
						lastFollow: date.toISOString(),
					});
					console.log("Nowy follow");
				} else {
					//TODO: napisac na chacie nice try: NICK
					console.log("Stary follow");
				}
			}
		);

		listener.onChannelSubscription(
			broadcasterId,
			async (event: EventSubChannelSubscriptionEvent) => {
				const user = await event.getUser();
				const subscription =
					await apiClient.subscriptions.getSubscriptionForUser(
						broadcasterId,
						user.id
					);
			}
		);

		listener.onChannelChatMessage(
			broadcasterId,
			broadcasterId,
			(data: EventSubChannelChatMessageEvent) => {
				console.log(data.messageText);
			}
		);
	}
}
