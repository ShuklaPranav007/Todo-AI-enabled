import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import todoRoutes from './routes/todos.js'
import teamRoutes from './routes/teams.js'
import teamTodoRoutes from './routes/teamTodos.js'

const app = express()

connectDB()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/todos', todoRoutes)
app.use('/api/teams', teamRoutes)
app.use('/api/team-todos', teamTodoRoutes)

app.get('/', (req, res) => {
  res.send('Todo AI Backend is running ✅')
})

app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
})