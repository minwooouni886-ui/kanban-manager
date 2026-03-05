const BASE = "http://localhost:3001/api/boards" // keep your actual backend port

export async function getBoards() {
  const r = await fetch(BASE)
  if (!r.ok) throw new Error("Failed to load boards")
  return r.json()
}

export async function createBoard(title, imageUrl) {
  const r = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, imageUrl }),
  })
  if (!r.ok) throw new Error("Failed to create board")
  return r.json()
}

export async function updateBoard(id, title, imageUrl) {
  const r = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, imageUrl }),
  })
  if (!r.ok) throw new Error("Failed to update board")
  return r.json()
}

export async function deleteBoard(id) {
  const r = await fetch(`${BASE}/${id}`, { method: "DELETE" })
  if (!r.ok && r.status !== 204) throw new Error("Failed to delete board")
}