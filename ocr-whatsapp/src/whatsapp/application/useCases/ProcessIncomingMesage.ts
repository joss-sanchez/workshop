import { IOcrResult } from '../../../ocr/domain/interfaces/IOcrResult';
import { OcrRepository } from '../../../ocr/domain/OcrRepository';
import { AlegraApiHttpClient } from '../../../shared/infrastructure/http/AlegraApiHttpClient';
import { WhatsappRepository } from '../../domain/WhatsappRepository';
import { ProcessImageMessage } from '../services/ProcessImageMessage';

export class ProcessIncomingMessage {
  private readonly processImageMessage: ProcessImageMessage;
  private readonly MESSAGES = {
    WELCOME: `*¡Hola y bienvenido!* 👋 \nSoy tu *asistente virtual* para la gestión de gastos empresariales. 📋✨
      \n📸 *Sube una foto* de tu recibo o factura y yo me encargaré de procesarlo rápidamente.`,
    SAVE_RECEIPT: 'Ok, vamos a guardar tu factura, esto puede tardar unos segundos.',
    TRY_AGAIN: 'Ok, no hay problema, puedes subir otra imagen o escribir "HOLA" para reiniciar el proceso.',
    NOT_UNDERSTOOD:
      'No entiendo lo que me estás diciendo, puedes subir una imagen o escribir "HOLA" para reiniciar el proceso.',
    ANALYZING_RECEIPT: 'Analizando tu recibo, esto puede tardar unos segundos...',
    SAVED_RECEIPT: 'Factura guardada correctamente. 🎉',
  };

  constructor(
    ocrRepository: OcrRepository,
    private readonly whatsappRepository: WhatsappRepository,
    private readonly alegraApiHttpClient: AlegraApiHttpClient,
  ) {
    this.processImageMessage = new ProcessImageMessage(ocrRepository);
  }

  async run(params: { from: string; to: string; message: string; mediaUrl?: string }): Promise<{ message: string }> {
    const { from, message, mediaUrl } = params;
    const tempOcrResult= {
      invoiceDate: new Date(),
      totalValue: 0,
    }
    const phone = this.removeWhatsappPrefix(from);
    const upperMessage = message.toUpperCase();

    if (upperMessage === 'HOLA') {
      return this.sendMessage(phone, this.MESSAGES.WELCOME);
    }

    if (mediaUrl) {
      await this.sendMessage(phone, this.MESSAGES.ANALYZING_RECEIPT);
      const text = await this.processImageMessage.run({ imageUrl: mediaUrl });
      return this.sendMessage(phone, this.formatReceiptDetails(text));
    }

    if (upperMessage === 'SI') {
      await this.sendMessage(phone, this.MESSAGES.SAVE_RECEIPT);
      await this.alegraApiHttpClient.createExpense({
        date: new Date(tempOcrResult.invoiceDate),
        total: tempOcrResult.totalValue,
      });
      return this.sendMessage(phone, this.MESSAGES.SAVED_RECEIPT);
    }

    if (upperMessage === 'NO') {
      return this.sendMessage(phone, this.MESSAGES.TRY_AGAIN);
    }

    return this.sendMessage(phone, this.MESSAGES.NOT_UNDERSTOOD);
  }

  private removeWhatsappPrefix(phone: string): string {
    return phone.replace('whatsapp:+', '');
  }

  private async sendMessage(to: string, message: string): Promise<{ message: string }> {
    await this.whatsappRepository.sendMessage({ to, message });
    return { message: 'Message sent' };
  }

  private formatReceiptDetails(text: IOcrResult): string {
    return `
      Acabamos de analizar tu imagen y hemos detectado la siguiente información:

      - *Número de Factura:* ${text.invoiceNumber}
      - *Valor Total:* ${text.totalValue} ${text.currency}
      - *Productos:*
      ${this.formatProducts(text.products, text.currency)}
      - *NIT o ID del Comprador:* ${text.buyerId}
      - *Dirección del Comprador:* ${text.buyerAddress || 'No disponible'}
      - *Fecha de la Factura:* ${text.invoiceDate}
      - *Hora de la Factura:* ${text.invoiceTime}
      - *Nombre del Comprador:* ${text.buyerName || 'No disponible'}
      - *Categoría:* ${text.category}\n

    Es correcto? (Si/No) 🤔
    `.trim();
  }

  private formatProducts(
    products: Record<string, string | number | null | undefined>[] | undefined,
    currency: string,
  ): string {
    return products?.map((product) => `  - ${product.name}: ${product.value} ${currency}`).join('\n') ?? '';
  }

}