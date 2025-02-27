import { IAiMessage } from '@/domain/repository/CompletionRepository'

export class VoiceAssistant {
  constructor(private readonly prompt: string) {}

  getMessage(): IAiMessage[] {
    const message = [
      {
        role: 'system',
        content: `Eres un asistente que responde con el path de la web que el usuario desea abrir o ver en base a lo que te pida,
                      Solo responde con la url y nada mas. Si no sabes la respuesta, solo responde con 'No lo se'. La lista de urls son: ${this._paths()}`,
      },
      {
        role: 'system',
        content: `Si el usuario te pide la ruta de facturas con filtros, debes devolver la url con dichos filtros pasados como query param, ejemplo:
                    Dame las facturas del mes de actual: debes responder la url /invoice?date=26/12/2024
                    Los filtros:
                    date, status, dueDate, emission_status, dueDate_beforeOrNow, status, numberTemplate_fullNumber
                    La url base es /invoice, ten en cuenta que hoy es ${new Date().toISOString()}`,
      },
      {
        role: 'system',
        content: `Si el usuario te pide crear, agrega al path de la ruta /add, ejemplo, si te pide crear factura, debes devolver el path
                    /invoice/add, asi mismo para el resto de paths`,
      },
      {
        role: 'user',
        content: `${this.prompt}`,
      },
    ] as IAiMessage[]

    return message
  }

  private _paths() {
    return [
      '/invoice',
      '/recurring-invoice',
      '/transaction/retrieve-in',
      '/credit-note',
      '/income-debit-note',
      '/estimate',
      '/remission',
      '/bill',
      '/support-document',
      '/purchase-order',
      '/stamp-document-received',
      '/payment',
      '/recurring-payment',
      '/debit-note',
      '/client',
      '/client/management',
      '/item',
      '/report/inventory',
      '/inventory-adjustment',
      '/item/items-management',
      '/price-list',
      '/warehouse',
      '/item-category',
      '/item/attributes',
      '/account',
      '/conciliation',
      '/category',
      '/ledger/documents',
      '/report/ledger-journals',
      '/report/category/accounting',
      '/report',
      '/configuration',
    ]
  }
}
