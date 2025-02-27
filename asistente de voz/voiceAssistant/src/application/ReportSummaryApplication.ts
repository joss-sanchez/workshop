import { ReportSummary } from '../domain/entities/ReportSummary'
import { CompletionRepository } from '@/domain/repository/CompletionRepository'
import { FetchRepository } from '../infrastructure/repository/FetchRepository'

export class ReportSummaryApplication {
  constructor(private readonly repository: CompletionRepository) {}

  async run(message: string, currency: string) {
    const entity = new ReportSummary(message)
    const getFormattedUrl = await this.repository.complete({
      messages: entity.getContent(),
    })

    const invoiceReportSummary = await entity.getInvoiceReportSummary(
      getFormattedUrl.content,
      'Bearer ' + process.env.ALEGRA_API_KEY
    )
      console.log("🚀 ~ ReportSummaryApplication ~ run ~ process.env.ALEGRA_API_KEY:", process.env.ALEGRA_API_KEY)
    console.log("🚀 ~ ReportSummaryApplication ~ run ~ invoiceReportSummary:", invoiceReportSummary)

    const summary = await this.repository.complete({
      messages: entity.getSummaryContent(
        invoiceReportSummary,
        message,
        getFormattedUrl.content,
        currency
      ),
    })

    const summaryMessage = entity.getSummaryMessage(summary.content)

    const textToSpeech = await FetchRepository.getTextToSpeech(
      summaryMessage.message
    )

    const audio = await textToSpeech.arrayBuffer()
    const base64Audio = Buffer.from(audio).toString('base64')

    return {
      ...summaryMessage,
      url: entity.getRedirectUrl(getFormattedUrl.content, summary.content),
      details: invoiceReportSummary,
      redirect: false,
      audio: base64Audio,
    }
  }
}
