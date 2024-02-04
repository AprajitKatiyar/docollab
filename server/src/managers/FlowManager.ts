import { Socket, Server } from "socket.io";
export class FlowManager {
  public addFlowHandlers(socket: Socket, projectId: string, io: Server) {
    this.createHandlers(socket, projectId, io);
  }
  private createHandlers(socket: Socket, projectId: string, io: Server) {
    socket.on("node-changes", (data, flowId) => {
      console.log("node received");
      socket.to(projectId).emit("receive-node-changes", data, flowId);
      io.in(projectId).emit("receive-node-preview-changes", data, flowId);
      console.log(data);
    });
    socket.on("edge-changes", (data, flowId) => {
      console.log("edge received");
      socket.to(projectId).emit("receive-edge-changes", data, flowId);
      io.in(projectId).emit("receive-edge-preview-changes", data, flowId);

      console.log(data);
    });
    socket.on("connection-changes", (data, flowId) => {
      console.log("node connection received");
      socket.to(projectId).emit("receive-connection-changes", data, flowId);
      io.in(projectId).emit("receive-connection-preview-changes", data, flowId);

      console.log(data);
    });
    socket.on("newnode-changes", (data, flowId) => {
      console.log("new node received");
      socket.to(projectId).emit("receive-newnode-changes", data, flowId);
      io.in(projectId).emit("receive-newnode-preview-changes", data, flowId);

      console.log(data);
    });
    socket.on("nodelabel-changes", (id, newLabel, flowId) => {
      console.log("Node label received");
      socket
        .to(projectId)
        .emit("receive-nodelabel-changes", id, newLabel, flowId);
      io.in(projectId).emit(
        "receive-nodelabel-preview-changes",
        id,
        newLabel,
        flowId
      );

      console.log(id, " ", newLabel);
    });
  }
}
