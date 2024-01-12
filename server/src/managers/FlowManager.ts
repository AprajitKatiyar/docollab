import { Socket } from "socket.io";
export class FlowManager {
  public addFlowHandlers(socket: Socket, projectId: string) {
    this.createHandlers(socket, projectId);
  }
  private createHandlers(socket: Socket, projectId: string) {
    socket.on("node-changes", (data) => {
      console.log("received");
      socket.to(projectId).emit("receive-node-changes", data);
      console.log(data);
    });
    socket.on("edge-changes", (data) => {
      console.log("received");
      socket.to(projectId).emit("receive-edge-changes", data);
      console.log(data);
    });
  }
}
