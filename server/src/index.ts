import express from "express";
const app = express();
const port = 3001;
import cors from "cors";
import prisma from "../prisma/client";

app.use(cors());
app.use(express.json());

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
      res.status(403).json({ message: "User already exists" });
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

app.listen(port, () => {
  console.log(`Backend server is up and running at http://localhost:${port}`);
});
