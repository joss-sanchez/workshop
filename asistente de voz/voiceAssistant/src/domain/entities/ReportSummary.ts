import { IAiMessage } from '@/domain/repository/CompletionRepository'

export class ReportSummary {
  constructor(private readonly message: string) {}

  getContent(): IAiMessage[] {
    return [
      {
        role: 'system',
        content:
          'Extrae la información necesaria del mensaje para completar la información de la url teniendo en cuenta el valor de dateFormat como el formato de fecha y devuelve solo la url,' +
          ', ten en cuenta que hoy es ' +
          new Date().toISOString() +
          ' ' +
          JSON.stringify(this.getInvoiceFormat()),
      },
    ] as IAiMessage[]
  }

  getInvoiceFormat = () => {
    return {
      url: '/api/v1/reports/invoices-open-totals?from={{dateFrom}}&to={{dateUntil}}',
      dateFormat: 'YYYY-MM-DD',
      message: this.message,
    }
  }

  async getInvoiceReportSummary(url: string, token: string) {
    const response = await fetch(`https://hopper.alegra.com${url}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
  })
  console.log("🚀 ~ ReportSummary ~ getInvoiceReportSummary ~ response:", response)
    if (response.status === 403) {
      throw new Error('Unauthorized')
    }

    return response.json()
  }

  getRedirectUrl(openAiChoice: string, message: string) {
    if (
      message.includes('En total vendiste') ||
      message.includes('NO_VENTAS')
    ) {
      return openAiChoice
        .replace('invoices-open-totals', 'sales')
        .replace('?from=', '/from/')
        .replace('&to=', '/to/')
        .replace('/api/v1/reports/', '/report/')
    } else if (
      message.includes('Para ese periodo') ||
      message.includes('NO_DEBEN')
    ) {
      return openAiChoice
        .replace('-totals', '')
        .replace('?from=', '/from/')
        .replace('&to=', '/to/')
        .replace('/api/v1/reports/', '/report/')
    }
  }

  getSummaryContent(
    message: object,
    question: string,
    periodUrl: string,
    currency: string
  ): IAiMessage[] {
    return [
      {
        role: 'system',
        content: 'Responder en forma de reporte a lo siguiente, debes decir el nombre de la moneda en lugar del acrónimo, Todo esto en una linea: ' +
          'En el caso de lo que se vendió o cuanto fueron las ventas debes decir el valor del atributo total y la cantidad de documentos, con un mensaje como "En total vendiste {{total}} {{monedaLegible}} en {{totalDocuments}} {{venta o ventas}} durante {{periodo de tiempo}}".' +
          'Si preguntan por lo que se deben o el monto por pagar, decir el missingAmoung , sin el total en un frase corta como en este periodo te deben, con un mensaje como "Para ese periodo de tiempo te deben {{missingAmoung}} {{monedaLegible}}".' +
          'Si los datos son 0, di unicamente NO_VENTAS cuando preguntan por ventas o NO_DEBEN cuando preguntan por lo que deben.' +
          ': ' +
          JSON.stringify({
            ...message,
            question,
            periodUrl,
            currency,
          })
      }
    ] as IAiMessage[]
  }

  getSummaryMessage(content: string | null): {
    message: string
    emoji: string
  } {
    const customTotal = [
      {
        message: 'No tienes ventas en esa fecha, ¿Buenas las vacaciones?',
        emoji: '🏖️',
      },
      {
        message:
          'Parece que ese día no vendiste nada. No te preocupes, aún puedes cerrar bien el mes',
        emoji: '✨',
      },
      {
        message:
          'Lo siento, no hay datos en esa fecha. Cuidado, a la DIAN no le gusta que escondas tus ventas ',
        emoji: '👀',
      },
    ]

    const customMissingAmount = [
      {
        message: 'No tienes cuentas por cobrar pendientes en esa fecha.',
        emoji: '👏',
      },
      {
        message:
          'Parece que no te deben nada de esa fecha, ¿Donde se consiguen esos clientes?',
        emoji: '🤔',
      },
      {
        message:
          '¿Seguro que no anotaste esas deudas en el cuaderno de la casa? Por aquí no hay cuentas por cobrar para esa fecha',
        emoji: '📓',
      },
    ]

    if (!content) {
      return {
        message: 'No se encontraron datos para mostrar',
        emoji: '',
      }
    }

    if (content.includes('NO_VENTAS')) {
      return customTotal[Math.floor(Math.random() * customTotal.length)]
    }

    if (content.includes('NO_DEBEN')) {
      return customMissingAmount[
        Math.floor(Math.random() * customMissingAmount.length)
      ]
    }

    return {
      message: content,
      emoji: '',
    }
  }
}
