import express from "express";
import { randomUUID } from "crypto";

const router = express.Router()
// In-memory data store (temporary, replace with a database in production)
let boards = []

// Get all boards
router.get("", (req, res) => {
    res.json(boards)
});

// Create a new board
router.post("", (req, res) => {
  const { title, imageUrl } = req.body
  if (!title || !title.trim()) return res.status(400).json({ error: "Title required" })

  const newBoard = {
    id: randomUUID(),
    title: title.trim(),
    imageUrl: imageUrl?.trim() || "",
  }

  boards.push(newBoard)
  res.status(201).json(newBoard)
})

// Get a specific board by ID
router.get("/:boardId", (req, res) => {
    const { boardId } = req.params
    const board = boards.find(b => b.id === boardId)
    if (!board) {
        return res.status(404).json({ error: "Board not found" })
    }
    res.json(board)
});

// Update a specific board by ID
router.put("/:boardId", (req, res) => {
  const { boardId } = req.params
  const { title, imageUrl } = req.body

  const board = boards.find((b) => b.id === boardId)
  if (!board) return res.status(404).json({ error: "Board not found" })

  if (title && title.trim()) board.title = title.trim()
  if (typeof imageUrl === "string") board.imageUrl = imageUrl.trim()

  res.json(board)
})

// Delete a specific board by ID
router.delete("/:boardId", (req, res) => {
    const { boardId } = req.params
    const board = boards.find(b => b.id === boardId)
    if (!board) {
        return res.status(404).json({ error: "Board not found" })
    }
    boards.splice(boards.indexOf(board), 1)
    res.status(204).send()
});

export default router