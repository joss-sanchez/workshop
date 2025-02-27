import OpenAI from "openai";
import { OcrRepository } from "../../domain/OcrRepository";
import { extractFieldsFromInvoiceTool } from "./tools/ExtractFieldsFromInvoice";

export class OpenAiOcrRepository implements OcrRepository {
  private readonly client: OpenAI;

  constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  
  async extractTextFromImage(base64Image: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      //model: "gpt-4-vision-preview",
      model: "gpt-4o",
      messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'You are a virtual assistant tasked with reading invoices and extracting their information. From this invoice, return only the extracted data as a JSON object. Do not include any explanations, additional text, or formatting.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        tools: [extractFieldsFromInvoiceTool()],
    });

    const content = response.choices[0].message.tool_calls?.[0]?.function.arguments;

    if (!content) {
      throw new Error('No content found');
    }

    return content;
  }
}