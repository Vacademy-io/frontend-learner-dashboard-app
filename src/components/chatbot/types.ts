export type MessageRole = 'user' | 'assistant';

export interface ChatbotContext {
  route: string;
  courseId?: string;
  packageSessionId?: string;
  subjectId?: string;
  moduleId?: string;
  chapterId?: string;
  slideId?: string;
  sessionId?: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  context?: ChatbotContext;
}

export interface ChatResponse {
  message: string;
}
