import express, { Router } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { CompletionsController } from './infrastructure/controllers/CompletionsController'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const router = Router()
router.post('/completions', CompletionsController.completions)

app.use(router)

app.listen(3001, () => console.log('Proxy server running on port 3001'))
