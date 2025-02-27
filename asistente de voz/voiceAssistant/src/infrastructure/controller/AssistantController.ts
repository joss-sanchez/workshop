import { Request, Response } from 'express'
import { VoiceAssistantApplication } from '../../application/VoiceAssistantApplication'
import { OpenAIRepository } from '../repository/OpenAIRepository'

export class AssistantController {
  static async assistant(req: Request, res: Response) {
    try {
      const { message } = req.body
      const application = new VoiceAssistantApplication(new OpenAIRepository())
      const result = await application.run(message)
      res.json(result)
    } catch (error) {
      console.error('Error processing completions:', error)
      res
        .status(500)
        .json({ success: false, error: 'Error processing request' })
    }
  }
}