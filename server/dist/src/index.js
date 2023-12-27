"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3001;
const cors_1 = __importDefault(require("cors"));
const client_1 = __importDefault(require("../prisma/client"));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Hello from backend server");
});
app.post("/auth/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name } = req.body;
        const user = yield client_1.default.user.findUnique({
            where: {
                email: email,
            },
        });
        if (user) {
            res.status(403).json({ message: "User already exists" });
        }
        else {
            const newUser = yield client_1.default.user.create({
                data: {
                    email: email,
                    password: password,
                    name: name,
                },
            });
            res.json({ message: "Signed up successfully", user: newUser });
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
}));
app.post("/auth/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield client_1.default.user.findUnique({
            where: {
                email: email,
                password: password,
            },
        });
        if (user) {
            res.json({ message: "Logged in successfully", user });
        }
        else {
            res.status(403).json({ message: "Invalid username or password" });
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
}));
app.post("/auth/saveOauthUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name } = req.body;
        const user = yield client_1.default.user.findUnique({
            where: {
                email: email,
            },
        });
        if (user) {
            res.status(403).json({ message: "User already exists" });
        }
        else {
            const newUser = yield client_1.default.user.create({
                data: {
                    email: email,
                    name: name,
                },
            });
            res.json({ message: "Saved Oauth user successfully", user: newUser });
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
}));
app.listen(port, () => {
    console.log(`Backend server is up and running at http://localhost:${port}`);
});
