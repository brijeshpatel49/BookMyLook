// server.js
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const authRouter = require("./routers/auth-router");
const salonRouter = require("./routers/salon-router");
const connectDB = require("./utils/db");
const errorMiddleware = require("./middlewares/error-middleware");
const adminRouter = require("./routers/admin-router");
const http = require("http");
const { Server } = require("socket.io");
const { handleSocketConnections } = require("./socket/socketHandler");

const corsOptions = {
  origin: ["http://localhost:5173", "https://book-my-look.vercel.app"],
  methods: "GET, POST, PUT, DELETE, PATCH",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/salon", salonRouter);
app.use("/api/admin", adminRouter);
app.use(errorMiddleware);

const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

handleSocketConnections(io);

const PORT = process.env.PORT || 7000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
