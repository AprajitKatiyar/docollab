import { Socket } from "socket.io";
export class FlowManager {
  public addFlowHandlers(socket: Socket, projectId: string) {
    this.createHandlers(socket, projectId);
  }
  private createHandlers(socket: Socket, projectId: string) {
    socket.on("node-changes", (data, flowId) => {
      console.log("node received");
      socket.to(projectId).emit("receive-node-changes", data, flowId);
      console.log(data);
    });
    socket.on("edge-changes", (data, flowId) => {
      console.log("edge received");
      socket.to(projectId).emit("receive-edge-changes", data, flowId);
      console.log(data);
    });
    socket.on("connection-changes", (data, flowId) => {
      console.log("node connection received");
      socket.to(projectId).emit("receive-connection-changes", data, flowId);
      console.log(data);
    });
    socket.on("newnode-changes", (data, flowId) => {
      console.log("new node received");
      socket.to(projectId).emit("receive-newnode-changes", data, flowId);
      console.log(data);
    });
    socket.on("nodelabel-changes", (id, newLabel, flowId) => {
      console.log("Node label received");
      socket
        .to(projectId)
        .emit("receive-nodelabel-changes", id, newLabel, flowId);
      console.log(id, " ", newLabel);
    });
  }
}
