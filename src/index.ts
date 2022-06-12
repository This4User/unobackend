import express, { NextFunction, Request, Response } from "express";
import { Server } from "socket.io";
import { RoomsController } from "./Controllers/RoomsController";
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "./Types/serverTypes";

require("dotenv").config();
const port = process.env.PORT;

const app = express();
const httpServer = require("http").createServer(app);
const io: Server = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer);

app.use((req: Request, res: Response, next: NextFunction) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
app.get("/", (req: Request, res: any) => {
	return res.json({ status: "ok" });
});

const rooms = new RoomsController(io);


io.on("connection", (socket) => {
	rooms.listenRoomsEvents(socket);
});


httpServer.listen(port, () => {
	console.log(`listening on ${port}`);
});