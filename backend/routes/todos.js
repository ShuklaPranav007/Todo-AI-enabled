import express from 'express'
import Todo from '../models/Todo.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

// @route  GET /api/todos
router.get('/', protect, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.status(200).json(todos)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// @route  POST /api/todos
router.post('/', protect, async (req, res) => {
  const { title, dueDate, priority } = req.body
  try {
    const todo = await Todo.create({
      user: req.user._id,
      title,
      dueDate: dueDate || null,
      priority: priority || 'medium',
    })
    res.status(201).json(todo)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// @route  PUT /api/todos/:id
router.put('/:id', protect, async (req, res) => {
  const { title, dueDate, priority } = req.body
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id })
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' })
    }
    todo.title = title || todo.title
    todo.dueDate = dueDate || todo.dueDate
    todo.priority = priority || todo.priority
    const updated = await todo.save()
    res.status(200).json(updated)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// @route  PUT /api/todos/:id/toggle
router.put('/:id/toggle', protect, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id })
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' })
    }
    todo.completed = !todo.completed
    const updated = await todo.save()
    res.status(200).json(updated)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// @route  DELETE /api/todos/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id })
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' })
    }
    await todo.deleteOne()
    res.status(200).json({ message: 'Todo deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

export default router
