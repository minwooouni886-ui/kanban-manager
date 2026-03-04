import express from "express";
import cors from "cors";
import "dotenv/config";
import boardsRouter from "./routes/boards.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});

app.use("/api/boards", boardsRouter)

// Columns
app.post("/api/boards/:boardId/columns", (req, res) => {
});

app.patch("/api/columns/:columnId", (req, res) => {
});

app.delete("/api/columns/:columnId", (req, res) => {
});

app.patch("/api/columns/:columnId/reorder", (req, res) => {
});

// Tasks
app.post("/api/columns/:columnId/tasks", (req, res) => {
});

app.patch("/api/tasks/:taskId", (req, res) => {
});

app.delete("/api/tasks/:taskId", (req, res) => {
});

app.patch("/api/tasks/:taskId/move", (req, res) => {
});

app.path("/api/tasks/:taskId/reorder", (req, res) => {
});