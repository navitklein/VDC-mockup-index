
export enum MockupStatus {
  IN_DESIGN = 'In Design',
  IN_REVIEW = 'In Review',
  IN_DEVELOPMENT = 'In Development',
  ARCHIVED = 'Archived'
}

export interface Mockup {
  id: string;
  title: string;
  description: string;
  status: MockupStatus;
  url: string;
  azureUrl?: string;
  docsUrl?: string;
  lastUpdated: string;
  author: string;
  version: string;
  tags: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
