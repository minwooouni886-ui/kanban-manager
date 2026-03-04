import express from "express"
import { randomUUID } from "crypto"

const router = express.Router()
// In-memory data store (temporary, replace with a database in production)
const boards = []

// Get all boards
app.get("/api/boards", (req, res) => {
});

// Create a new board
app.post("/api/boards", (req, res) => {
}); 

// Get a specific board by ID
app.get("/api/boards/:boardId", (req, res) => {
});

// Update a specific board by ID
app.patch("/api/boards/:boardId", (req, res) => {
});

// Delete a specific board by ID
app.delete("/api/boards/:boardId", (req, res) => {
});

export default router