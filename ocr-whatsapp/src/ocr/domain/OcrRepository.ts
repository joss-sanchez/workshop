export interface OcrRepository {
  extractTextFromImage(imageUrl: string): Promise<string>
}