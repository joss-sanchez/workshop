import {
  CompletionRepository,
  IAiMessage,
} from '@/domain/repository/CompletionRepository'
import { OpenAI } from 'openai'

export class OpenAIRepository implements CompletionRepository {
  async complete({
    messages,
  }: {
    messages: IAiMessage[]
    includeReason?: boolean
  }): Promise<IAiMessage> {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
    })

    const message = completion.choices[0].message
    if (message.content === null) {
      throw new Error('OpenAI returned null content')
    }

    return {
      role: message.role,
      content: message.content,
    }
  }
}
