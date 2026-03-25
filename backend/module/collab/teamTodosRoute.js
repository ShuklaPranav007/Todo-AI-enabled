import express from 'express'
import TeamTodo from './TeamTodo.js'
import Team from './Team.js'
import protect from '../../middleware/authMiddleware.js'

const router = express.Router()

const isMember = (team, userId) => {
  const isAdmin = team.admin.toString() === userId.toString()
  const isMember = team.members.some(
    (m) => m.user.toString() === userId.toString() && m.status === 'accepted'
  )
  return isAdmin || isMember
}

// GET /api/team-todos/:teamId
router.get('/:teamId', protect, async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId)
    if (!team) return res.status(404).json({ message: 'Team not found' })
    if (!isMember(team, req.user._id)) return res.status(403).json({ message: 'Not a team member' })

    const todos = await TeamTodo.find({ team: req.params.teamId })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('completedBy', 'name email')
      .sort({ createdAt: -1 })

    res.status(200).json(todos)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// POST /api/team-todos/:teamId
router.post('/:teamId', protect, async (req, res) => {
  const { title, description, assignedTo, priority, dueDate } = req.body
  try {
    const team = await Team.findById(req.params.teamId)
    if (!team) return res.status(404).json({ message: 'Team not found' })
    if (!isMember(team, req.user._id)) return res.status(403).json({ message: 'Not a team member' })

    const todo = await TeamTodo.create({
      team: req.params.teamId,
      title,
      description,
      createdBy: req.user._id,
      assignedTo: assignedTo || null,
      priority: priority || 'medium',
      dueDate: dueDate || null,
    })

    const populated = await TeamTodo.findById(todo._id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')

    res.status(201).json(populated)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// PUT /api/team-todos/:teamId/:todoId/toggle
router.put('/:teamId/:todoId/toggle', protect, async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId)
    if (!team) return res.status(404).json({ message: 'Team not found' })

    const todo = await TeamTodo.findById(req.params.todoId)
    if (!todo) return res.status(404).json({ message: 'Todo not found' })

    const isAdmin = team.admin.toString() === req.user._id.toString()
    const isAssigned = todo.assignedTo?.toString() === req.user._id.toString()

    if (!isAdmin && !isAssigned) {
      return res.status(403).json({ message: 'Only admin or assigned user can complete this task' })
    }

    todo.completed = !todo.completed
    todo.completedBy = todo.completed ? req.user._id : null
    await todo.save()

    const populated = await TeamTodo.findById(todo._id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('completedBy', 'name email')

    res.status(200).json(populated)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// PUT /api/team-todos/:teamId/:todoId
router.put('/:teamId/:todoId', protect, async (req, res) => {
  const { title, description, assignedTo, priority, dueDate } = req.body
  try {
    const team = await Team.findById(req.params.teamId)
    if (!team) return res.status(404).json({ message: 'Team not found' })

    const isAdmin = team.admin.toString() === req.user._id.toString()
    if (!isAdmin) return res.status(403).json({ message: 'Only admin can edit tasks' })

    const todo = await TeamTodo.findById(req.params.todoId)
    if (!todo) return res.status(404).json({ message: 'Todo not found' })

    todo.title = title || todo.title
    todo.description = description || todo.description
    todo.assignedTo = assignedTo || todo.assignedTo
    todo.priority = priority || todo.priority
    todo.dueDate = dueDate || todo.dueDate

    await todo.save()

    const populated = await TeamTodo.findById(todo._id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('completedBy', 'name email')

    res.status(200).json(populated)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// DELETE /api/team-todos/:teamId/:todoId
router.delete('/:teamId/:todoId', protect, async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId)
    if (!team) return res.status(404).json({ message: 'Team not found' })

    const isAdmin = team.admin.toString() === req.user._id.toString()
    if (!isAdmin) return res.status(403).json({ message: 'Only admin can delete tasks' })

    const todo = await TeamTodo.findById(req.params.todoId)
    if (!todo) return res.status(404).json({ message: 'Todo not found' })

    await todo.deleteOne()
    res.status(200).json({ message: 'Todo deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

export default router