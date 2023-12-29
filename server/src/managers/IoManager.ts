import httpServer from "..";
import { Server } from "socket.io";

export class IoManager {
  private static io: Server;
  public static getIo() {
    if (!this.io) {
      const io = new Server(httpServer, {
        cors: {
          origin: "*",
          methods: ["GET", "POST"],
        },
      });
      this.io = io;
    }
    return this.io;
  }
}
