import { Socket } from "socket.io";
export class FlowManager {
  public addFlowHandlers(socket: Socket, projectId: string) {
    this.createHandlers(socket, projectId);
  }
  private createHandlers(socket: Socket, projectId: string) {
    socket.on("flow", (data) => {
      socket.emit("test", "received");
      console.log(data);
    });
  }
}
