import { OcrRepository } from '../../../ocr/domain/OcrRepository';
import { TransformImage } from '../../../ocr/application/services/TransformImage';
import { IOcrResult } from '../../../ocr/domain/interfaces/IOcrResult';

export class ProcessImageMessage {
  private readonly transformImageService: TransformImage;

  constructor(private readonly ocrRepository: OcrRepository) {
    this.transformImageService = new TransformImage();
  }

  async run(params: { imageUrl: string }) {
    const base64Image = await this.transformImageService.transformImage(params.imageUrl);

    const text = await this.ocrRepository.extractTextFromImage(base64Image);

    return JSON.parse(text) as IOcrResult;
  }
}