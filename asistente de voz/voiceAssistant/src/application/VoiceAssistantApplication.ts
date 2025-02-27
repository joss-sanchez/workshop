import { VoiceAssistant } from '../domain/entities/VoiceAssistant'
import { CompletionRepository } from '@/domain/repository/CompletionRepository'

export class VoiceAssistantApplication {
  constructor(private readonly repository: CompletionRepository) {}

  async run(message: string) {
    const entity = new VoiceAssistant(message)
    const completion = await this.repository.complete({
      messages: entity.getMessage(),
    })

    if (completion.content === 'No lo se.') {
      return { url: 'Eso no lo puedo hacer', redirect: false }
    }

    return { url: completion.content, redirect: true }
  }
}
