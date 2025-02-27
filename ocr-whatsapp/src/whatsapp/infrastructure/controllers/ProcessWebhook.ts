import { Request, Response } from 'express';
import { OpenAiOcrRepository } from '../../../ocr/infrastructure/openai/OpenAiOcrRepository';
import { IWhatsappWebhook } from '../../domain/interfaces/IWhatsappWebhook';
import { ProcessIncomingMessage } from '../../application/useCases/ProcessIncomingMesage';
import { TwilioWhatsappRepository } from '../TwilioWhatsappRepository';
import { AlegraApiHttpClient } from '../../../shared/infrastructure/http/AlegraApiHttpClient';

export class ProcessWebhook {
  static async run(req: Request, res: Response) {
    try {
      console.log('Processing webhook');
      const body: IWhatsappWebhook = req.body;

      const openAiOcrRepository = new OpenAiOcrRepository();
      const whatsappRepository = new TwilioWhatsappRepository();
      const alegraApiHttpClient = new AlegraApiHttpClient(
        'https://gates.alegra.com/api',
        process.env.ALEGRA_API_TOKEN || '',
      );

      const processIncomingMessage = new ProcessIncomingMessage(openAiOcrRepository, whatsappRepository, alegraApiHttpClient);
      await processIncomingMessage.run({
        from: body.From,
        to: body.To,
        message: body.Body,
        mediaUrl: body.MediaUrl0,
      });

      res.status(200).json({
        message: 'Message received',
      });
    } catch (error) {
      console.error('Error processing webhook', error);

      res.status(500).json({
        message: 'Error processing message',
      });
    }
  }
}