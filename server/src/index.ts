import express from "express";
import http from "http";
import cors from "cors";
import prisma from "../prisma/client";
import { IoManager } from "./managers/IoManager";
import { FlowManager } from "./managers/FlowManager";

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

httpServer.listen(port, () => {
  console.log(`Backend server is up and running at http://localhost:${port}`);
});
export default httpServer;
const io = IoManager.getIo();
const flowManager = new FlowManager();
io.on("connection", (socket) => {
  console.log("New Connection");
  flowManager.addFlowHandlers(socket);
});
