import { Socket, Server } from "socket.io";
export class DocManager {
  public addDocHandlers(socket: Socket, projectId: string, io: Server) {
    this.createHandlers(socket, projectId, io);
  }
  private createHandlers(socket: Socket, projectId: string, io: Server) {
    socket.on("doc-changes", (data, docId) => {
      console.log("received");
      socket.to(projectId).emit("receive-doc-changes", data, docId);
      io.in(projectId).emit("receive-doc-preview-changes", data, docId);
      console.log(data);
    });
  }
}
