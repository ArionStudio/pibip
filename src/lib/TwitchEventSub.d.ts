export interface WebSocketMessage {
	metadata: {
		message_id: string;
		message_type: "session_welcome" | "session_keepalive";
		message_timestamp: string; // UTC date
	};
}

export interface WebSocketWelcomeMessage extends WebSocketMessage {
	payload: {
		session: {
			id: string;
			status: string;
			connected_at?: string; // UTC date
			keepalive_timeout_seconds: number;
			reconnect_url?: string;
		};
	};
}

export type SubscriptionTypes =
	| "channel.follow"
	| "channel.ad_break.begin"
	| "channel.chat.message"
	| "channel.subscribe"
	| "channel.subscription.gift"
	| "channel.subscription.message"
	| "channel.cheer"
	| "channel.raid"
	| "channel.channel_points_automatic_reward_redemption.add"
	| "channel.channel_points_custom_reward_redemption.add"
	| "channel.poll.begin"
	| "channel.poll.progress"
	| "channel.poll.end"
	| "channel.prediction.begin"
	| "channel.prediction.progress"
	| "channel.prediction.end"
	| "drop.entitlement.grant"
	| "extension.bits_transaction.create"
	| "channel.goal.begin"
	| "channel.goal.progress"
	| "channel.goal.end"
	| "channel.hype_train.begin"
	| "channel.hype_train.progress"
	| "channel.hype_train.end"
	| "stream.online"
	| "stream.offline";

export interface ApiBody {
	type: string;
	version: "1";
	condition: any;
	transport: {
		method: "websocket";
		session_id: string;
	};
}

export interface ApiResponse {
	data: {
		id: number;
		status: "enabled";
		type: string;
		version: number;
		condition: any;
		created_at: string; //RFC3339
		transport: {
			method: "webhook";
			session_id: string;
		};
		cost: number;
		connected_at: string; // UTC
	}[];

	total: number;
	total_cost: number;
	max_total_cost: number;
}


