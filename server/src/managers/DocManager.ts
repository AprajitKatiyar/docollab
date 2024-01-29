import { Socket } from "socket.io";
export class DocManager {
  public addDocHandlers(socket: Socket, projectId: string) {
    this.createHandlers(socket, projectId);
  }
  private createHandlers(socket: Socket, projectId: string) {
    socket.on("doc-changes", (data, docId) => {
      console.log("received");
      socket.to(projectId).emit("receive-doc-changes", data, docId);
      console.log(data);
    });
  }
}
