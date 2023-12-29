import { Socket } from "socket.io";
export class FlowManager {
  public addFlowHandlers(socket: Socket) {
    this.createHandlers(socket);
  }
  private createHandlers(socket: Socket) {
    socket.on("test1", (data) => {
      socket.emit("test", "received");
      console.log(data);
    });
    socket.emit("test", "sent");
  }
}
