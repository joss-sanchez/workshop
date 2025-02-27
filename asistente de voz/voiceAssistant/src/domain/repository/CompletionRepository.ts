export interface IAiMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface CompletionRepository {
  complete({ messages }: { messages: IAiMessage[] }): Promise<IAiMessage>;
}
