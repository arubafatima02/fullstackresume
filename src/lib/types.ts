export interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  category: string;
  link: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export type Page = 'home' | 'ask-ai' | 'admin';

export type GameType = 'snake' | 'trivia' | 'terminal' | null;
