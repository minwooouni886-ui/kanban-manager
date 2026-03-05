import { useEffect, useMemo, useState } from "react"
import { createBoard, deleteBoard, getBoards, updateBoard } from "../api/boards"
import "./BoardsPage.css"

const DEFAULT_COVERS = [
  "https://images.unsplash.com/photo-1526481280695-3c687fd5432c?auto=format&fit=crop&w=1200&q=60",
  "https://images.unsplash.com/photo-1520975682031-a60f7063d9dd?auto=format&fit=crop&w=1200&q=60",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=60",
  "https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&w=1200&q=60",
]

function Modal({ title, children, onClose }) {
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [onClose])

  return (
    <div className="modalBackdrop" onMouseDown={onClose}>
      <div className="modalCard" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modalHeader">
          <h2 className="modalTitle">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function BoardsPage() {
  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isRenameOpen, setIsRenameOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  // Form state
  const [formTitle, setFormTitle] = useState("")
  const [formImageUrl, setFormImageUrl] = useState("")

  // Selected board for rename/delete
  const [selected, setSelected] = useState(null)

  const randomCover = useMemo(() => {
    return DEFAULT_COVERS[Math.floor(Math.random() * DEFAULT_COVERS.length)]
  }, [isCreateOpen]) // change suggestion each time modal opens

  async function refresh() {
    setLoading(true)
    setError("")
    try {
      const data = await getBoards()
      setBoards(data)
    } catch (e) {
      setError(e?.message ?? "Error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  function openCreate() {
    setFormTitle("")
    setFormImageUrl("")
    setSelected(null)
    setIsCreateOpen(true)
  }

  function openRename(board) {
    setSelected(board)
    setFormTitle(board.title ?? "")
    setFormImageUrl(board.imageUrl ?? "")
    setIsRenameOpen(true)
  }

  function openDelete(board) {
    setSelected(board)
    setIsDeleteOpen(true)
  }

  async function onCreateSubmit(e) {
    e.preventDefault()
    const title = formTitle.trim()
    if (!title) return

    const imageUrl = (formImageUrl.trim() || randomCover).trim()

    setError("")
    try {
      const newBoard = await createBoard(title, imageUrl)
      setBoards((prev) => [newBoard, ...prev])
      setIsCreateOpen(false)
    } catch (e) {
      setError(e?.message ?? "Error")
    }
  }

  async function onRenameSubmit(e) {
    e.preventDefault()
    if (!selected) return

    const title = formTitle.trim()
    if (!title) return
    const imageUrl = formImageUrl.trim()

    setError("")
    try {
      const updated = await updateBoard(selected.id, title, imageUrl)
      setBoards((prev) => prev.map((b) => (b.id === selected.id ? updated : b)))
      setIsRenameOpen(false)
      setSelected(null)
    } catch (e) {
      setError(e?.message ?? "Error")
    }
  }

  async function onDeleteConfirm() {
    if (!selected) return
    setError("")
    try {
      await deleteBoard(selected.id)
      setBoards((prev) => prev.filter((b) => b.id !== selected.id))
      setIsDeleteOpen(false)
      setSelected(null)
    } catch (e) {
      setError(e?.message ?? "Error")
    }
  }

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <div className="logoBlob" aria-hidden="true" />
          <div>
            <h1 className="title">Kanban Boards</h1>
            <p className="subtitle">Create, rename, and organize your boards</p>
          </div>
        </div>

        <button className="primaryButton" onClick={openCreate}>
          + Add Board
        </button>
      </header>

      {error && <div className="errorBanner">{error}</div>}

      {loading ? (
        <div className="stateText">Loading…</div>
      ) : boards.length === 0 ? (
        <div className="emptyState">
          <div className="emptyCard">
            
            <div className="emptyText">
              <h2 className="emptyTitle">No boards yet</h2>
              <p className="emptySubtitle">Click the button to the right to create your first board!</p>
            </div>
            <button className="secondaryButton" onClick={openCreate}>
              Create a board
            </button>
          </div>
        </div>
      ) : (
        <section className="grid">
          {boards.map((b) => (
            <article key={b.id} className="boardCard">
              <div className="coverWrap">
                <img
                  className="coverImg"
                  src={b.imageUrl || DEFAULT_COVERS[0]}
                  alt=""
                  loading="lazy"
                />
                <div className="coverOverlay" />
                <div className="cardActions">
                  <button className="chip" onClick={() => openRename(b)}>Rename</button>
                  <button className="chip danger" onClick={() => openDelete(b)}>Delete</button>
                </div>
              </div>

              <div className="boardBody">
                <div className="boardTitleRow">
                  <h3 className="boardTitle">{b.title}</h3>
                </div>
                <p className="boardMeta">ID: {b.id.slice(0, 8)}…</p>
              </div>
            </article>
          ))}
        </section>
      )}

      {isCreateOpen && (
        <Modal title="Create a new board" onClose={() => setIsCreateOpen(false)}>
          <form className="form" onSubmit={onCreateSubmit}>
            <label className="label">
              Board name
              <input
                className="input"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Spring Semester"
                required
                autoFocus
              />
            </label>

            <label className="label">
              Cover image URL (optional)
              <input
                className="input"
                value={formImageUrl}
                onChange={(e) => setFormImageUrl(e.target.value)}
                placeholder="Paste an image link (or leave blank for a random cover)"
              />
            </label>

            <div className="hint">
              Tip: leave the image empty and we’ll pick a colorful cover for you.
            </div>

            <div className="modalFooter">
              <button type="button" className="ghostButton" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="primaryButton">
                Create board
              </button>
            </div>
          </form>
        </Modal>
      )}

      {isRenameOpen && selected && (
        <Modal title={`Edit “${selected.title}”`} onClose={() => setIsRenameOpen(false)}>
          <form className="form" onSubmit={onRenameSubmit}>
            <label className="label">
              New name
              <input
                className="input"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="New board name"
                required
                autoFocus
              />
            </label>

            <label className="label">
              Cover image URL (optional)
              <input
                className="input"
                value={formImageUrl}
                onChange={(e) => setFormImageUrl(e.target.value)}
                placeholder="Paste a new image link (optional)"
              />
            </label>

            <div className="modalFooter">
              <button type="button" className="ghostButton" onClick={() => setIsRenameOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="primaryButton">
                Save changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {isDeleteOpen && selected && (
        <Modal title="Delete board?" onClose={() => setIsDeleteOpen(false)}>
          <div className="confirmText">
            This will delete <strong>{selected.title}</strong>. You can’t undo this.
          </div>
          <div className="modalFooter">
            <button type="button" className="ghostButton" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </button>
            <button type="button" className="dangerButton" onClick={onDeleteConfirm}>
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}