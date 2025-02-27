import express, { Router } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { ReportSummaryController } from './infrastructure/controller/ReportSummaryController'
import { AssistantController } from './infrastructure/controller/AssistantController'
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const router = Router()

router.post('/assistant', AssistantController.assistant)
router.post('/report-summary', ReportSummaryController.reportSummary)

app.use(router)

app.listen(3000, () => console.log('Proxy server running on port 3000'))