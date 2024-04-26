import { Socket, Server } from "socket.io";
export class ProjectManager {
  public addProjectHandlers(socket: Socket, projectId: string, io: Server) {
    this.createHandlers(socket, projectId, io);
  }
  private createHandlers(socket: Socket, projectId: string, io: Server) {
    socket.on("project-changes", (updatedProject, projectId) => {
      console.log("received project changes!");
      socket
        .to(projectId)
        .emit("receive-project-changes", updatedProject.project, projectId);
      console.log(updatedProject);
    });
  }
}
