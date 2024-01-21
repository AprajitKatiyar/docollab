import express from "express";
import http from "http";
import cors from "cors";
import prisma from "../prisma/client";
import { IoManager } from "./managers/IoManager";
import { FlowManager } from "./managers/FlowManager";
import { DocManager } from "./managers/DocManager";

const app = express();
const port = 3001;
app.use(cors());
app.use(express.json());

const httpServer = http.createServer(app);

app.get("/", (req, res) => {
  res.send("Hello from backend server");
});

app.post("/auth/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      res.status(403).json({ message: "User already exists" });
    } else {
      const newUser = await prisma.user.create({
        data: {
          email: email,
          password: password,
          name: name,
        },
      });
      res.json({ message: "Signed up successfully", user: newUser });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
        password: password,
      },
    });
    if (user) {
      res.json({ message: "Logged in successfully", user });
    } else {
      res.status(403).json({ message: "Invalid username or password" });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});
app.post("/auth/saveOauthUser", async (req, res) => {
  try {
    const { email, name } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      res.status(403).json({ message: "User already exists", user: user });
    } else {
      const newUser = await prisma.user.create({
        data: {
          email: email,
          name: name,
        },
      });
      res.json({ message: "Saved Oauth user successfully", user: newUser });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});
app.get("/users/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      res.json({ message: "User found", user: user });
    } else {
      res.status(403).json({ message: "User not found" });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});
app.post("/projects/createProject", async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await prisma.project.create({
      data: {
        users: {
          create: [
            {
              userId: userId,
              isOwner: true,
            },
          ],
        },
      },
    });
    if (project)
      res.json({
        message: "Project created successfully",
        project: project,
      });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});
app.post("/projects/createDoc", async (req, res) => {
  try {
    const { projectId, order, data } = req.body;
    const doc = await prisma.doc.create({
      data: {
        projectId: projectId,
        order: order,
        data: data,
      },
    });
    if (doc)
      res.json({
        message: "Doc created successfully",
        doc: doc,
      });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});
app.post("/projects/createFlow", async (req, res) => {
  try {
    const { projectId, order, data } = req.body;
    const flow = await prisma.flow.create({
      data: {
        projectId: projectId,
        order: order,
        data: data,
      },
    });
    if (flow)
      res.json({
        message: "Flow created successfully",
        flow: flow,
      });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});
app.put("/docs/save/:docId", async (req, res) => {
  try {
    const { docId } = req.params;
    const { data } = req.body;
    const updatedDoc = await prisma.doc.update({
      where: { id: docId },
      data: {
        data: data,
      },
    });
    if (updatedDoc)
      res.json({
        message: "Doc saved successfully",
        updatedDoc: updatedDoc,
      });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});
app.get("/docs/getDoc/:docId", async (req, res) => {
  try {
    const { docId } = req.params;
    const doc = await prisma.doc.findUnique({
      where: { id: docId },
    });
    if (doc)
      res.json({
        message: "Doc found successfully",
        doc: doc,
      });
    else {
      res.status(403).json({ message: "Invalid Doc id" });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});
app.put("/flows/save/:flowId", async (req, res) => {
  try {
    const { flowId } = req.params;
    const { data } = req.body;
    const updatedFlow = await prisma.flow.update({
      where: { id: flowId },
      data: {
        data: data,
      },
    });
    if (updatedFlow)
      res.json({
        message: "Flow saved successfully",
        updatedFlow: updatedFlow,
      });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});
app.get("/flows/getFlow/:flowId", async (req, res) => {
  try {
    const { flowId } = req.params;
    const flow = await prisma.flow.findUnique({
      where: { id: flowId },
    });
    if (flow)
      res.json({
        message: "Flow found successfully",
        flow: flow,
      });
    else {
      res.status(403).json({ message: "Invalid Flow id" });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

httpServer.listen(port, () => {
  console.log(`Backend server is up and running at http://localhost:${port}`);
});
export default httpServer;
const io = IoManager.getIo();
const flowManager = new FlowManager();
const docManager = new DocManager();
io.on("connection", (socket) => {
  console.log("New Connection");
  let projectId: string = "";
  socket.on("joinProject", (receivedProjectId) => {
    socket.join(receivedProjectId);
    projectId = receivedProjectId;
    console.log(`Socket ${socket.id} joined project ${projectId}`);

    //register event handlers
    flowManager.addFlowHandlers(socket, projectId);
    docManager.addDocHandlers(socket, projectId);
  });
});
