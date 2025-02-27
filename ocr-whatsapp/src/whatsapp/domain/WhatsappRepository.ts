export interface WhatsappRepository {
  sendMessage(params: { to: string, message:string}): Promise<void>
}