import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { ensureMigrations } from './migrate'
import { requireAuth } from './auth'
import favouritesRouter from './routes/favourites'

const app = express()
const PORT = Number(process.env.PORT || 3000)

ensureMigrations()

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())

app.get('/health', (_req, res) => res.json({ ok: true }))

app.use('/api/favourites', requireAuth, favouritesRouter)

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
})
