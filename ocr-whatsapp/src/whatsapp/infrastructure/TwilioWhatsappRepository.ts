import { WhatsappRepository } from '../domain/WhatsappRepository';
import { Twilio } from 'twilio';

export class TwilioWhatsappRepository implements WhatsappRepository {
  private readonly client: Twilio;

  constructor() {
    this.client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }

  async sendMessage(params: { to: string; message: string }): Promise<void> {
    await this.client.messages.create({
      from: `whatsapp:+${process.env.TWILIO_WHATSAPP_SANDBOX_NUMBER}`,
      to: `whatsapp:+${params.to}`,
      body: params.message,
    });
  }
}