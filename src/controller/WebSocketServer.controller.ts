import { Server as SocketIOServer, Socket } from "socket.io";
import { createServer, Server as HTTPServer } from "http";

type Message = {
	broadcasterId: string;
};

class WebSocketServer {
	private static instance: WebSocketServer;
	private io: SocketIOServer | null = null;
	private httpServer: HTTPServer | null = null;

	private constructor() {}

	// Singleton getter
	public static getInstance(): WebSocketServer {
		if (!WebSocketServer.instance) {
			WebSocketServer.instance = new WebSocketServer();
		}
		return WebSocketServer.instance;
	}

	// Method to initialize the server
	public init(port: number): SocketIOServer {
		if (!this.io) {
			this.httpServer = createServer();
			this.io = new SocketIOServer(this.httpServer);

			this.io.on("connection", (socket: Socket) => {
				console.log(`Client connected: ${socket.id}`);

				// Handle incoming messages with broadcasterId
				socket.on("message", (msg: Message) => {
					if (msg.broadcasterId) {
						console.log(
							`Received message from broadcasterId: ${msg.broadcasterId}`
						);
					} else {
						console.log("Message does not contain broadcasterId.");
					}
				});

				socket.on("disconnect", () => {
					console.log(`Client disconnected: ${socket.id}`);
				});
			});

			this.httpServer.listen(port, () => {
				console.log(`WebSocket server listening on port ${port}`);
			});
		}
		return this.io;
	}

	// Method to send a message to all connected clients
	public sendMessage(event: string, message: any) {
		if (this.io) {
			this.io.emit(event, message);
		} else {
			console.error("WebSocket server is not initialized.");
		}
	}
}

export default WebSocketServer;
