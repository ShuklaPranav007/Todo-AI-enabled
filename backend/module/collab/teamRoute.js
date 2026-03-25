import express from 'express'
import Team from './Team.js'
import User from '../auth/User.js'
import protect from '../../middleware/authMiddleware.js'

const router = express.Router()

// GET /api/teams — get all teams for logged in user
router.get('/', protect, async (req, res) => {
  try {
    const teams = await Team.find({
      $or: [
        { admin: req.user._id },
        { members: { $elemMatch: { user: req.user._id, status: 'accepted' } } },
      ],
    })
      .populate('admin', 'name email')
      .populate('members.user', 'name email')
      .sort({ createdAt: -1 })

    res.status(200).json(teams)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// GET /api/teams/invites — get pending invites for logged in user
router.get('/invites', protect, async (req, res) => {
  try {
    const invites = await Team.find({
      members: {
        $elemMatch: { user: req.user._id, status: 'pending' },
      },
    })
      .populate('admin', 'name email')
      .sort({ createdAt: -1 })

    res.status(200).json(invites)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// POST /api/teams — create a new team
router.post('/', protect, async (req, res) => {
  const { name, description } = req.body
  try {
    const team = await Team.create({
      name,
      description,
      admin: req.user._id,
      members: [],
    })

    const populated = await team.populate('admin', 'name email')
    res.status(201).json(populated)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// POST /api/teams/:id/invite — admin invites a user by email
router.post('/:id/invite', protect, async (req, res) => {
  const { email } = req.body
  try {
    const team = await Team.findById(req.params.id)
    if (!team) return res.status(404).json({ message: 'Team not found' })

    if (team.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only admin can invite members' })
    }

    const userToInvite = await User.findOne({ email })
    if (!userToInvite) {
      return res.status(404).json({ message: 'No user found with this email' })
    }

    if (userToInvite._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot invite yourself' })
    }

    const alreadyMember = team.members.find(
      (m) => m.user.toString() === userToInvite._id.toString()
    )
    if (alreadyMember) {
      return res.status(400).json({ message: 'User already invited or a member' })
    }

    team.members.push({ user: userToInvite._id, status: 'pending' })
    await team.save()

    const populated = await Team.findById(team._id)
      .populate('admin', 'name email')
      .populate('members.user', 'name email')

    res.status(200).json(populated)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// PUT /api/teams/:id/invite/respond — accept or decline invite
router.put('/:id/invite/respond', protect, async (req, res) => {
  const { status } = req.body
  try {
    const team = await Team.findById(req.params.id)
    if (!team) return res.status(404).json({ message: 'Team not found' })

    const member = team.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    )
    if (!member) return res.status(404).json({ message: 'Invite not found' })

    member.status = status
    if (status === 'accepted') member.joinedAt = new Date()

    await team.save()
    res.status(200).json({ message: `Invite ${status}` })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// DELETE /api/teams/:id — admin deletes team
router.delete('/:id', protect, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
    if (!team) return res.status(404).json({ message: 'Team not found' })

    if (team.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only admin can delete team' })
    }

    await team.deleteOne()
    res.status(200).json({ message: 'Team deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// DELETE /api/teams/:id/members/:userId — admin removes a member
router.delete('/:id/members/:userId', protect, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
    if (!team) return res.status(404).json({ message: 'Team not found' })

    if (team.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only admin can remove members' })
    }

    team.members = team.members.filter(
      (m) => m.user.toString() !== req.params.userId
    )
    await team.save()
    res.status(200).json({ message: 'Member removed' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

export default router