import { Socket } from "socket.io";
export class DocManager {
  public addDocHandlers(socket: Socket, projectId: string) {
    this.createHandlers(socket, projectId);
  }
  private createHandlers(socket: Socket, projectId: string) {
    socket.on("test1", (data) => {
      socket.emit("test", "received");
      console.log(data);
    });
  }
}
