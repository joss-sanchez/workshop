import { Request, Response } from 'express'
import { OpenAIRepository } from '../repository/OpenAIRepository'
import { ReportSummaryApplication } from '../../application/ReportSummaryApplication'

export class ReportSummaryController {
  static async reportSummary(req: Request, res: Response) {
    try {
      const { message, currency = 'USD' } = req.body
      const application = new ReportSummaryApplication(new OpenAIRepository())
      const response = await application.run(message, currency)
      res.status(200).json(response)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error al obtener el resumen de ventas' })
    }
  }
}