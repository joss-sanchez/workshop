export class FetchRepository {
  static async getTextToSpeech(message: string) {
    const response = await fetch(process.env.OPEN_AI_SPEECH as string, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        input: message,
        voice: "alloy", // Opciones: alloy, nova, echo, etc.
        response_format: "mp3",
      }),
    });
    return response;
  }
}
