export interface Language {
  code: string;
  name: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese (Mandarin)', flag: '🇨🇳' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
];

export enum LearningGoal {
  GRAMMAR = 'Grammar Practice',
  VOCABULARY = 'Vocabulary Building',
  WRITING = 'Writing Correction',
  TRANSLATION = 'Translation Help',
  PRONUNCIATION = 'Pronunciation Guide',
  CONVERSATION = 'Conversation Practice',
  PLAN = 'Personalized Plan',
  QUIZ = 'Quizzes & Exercises'
}

export interface WritingCorrectionResult {
  correctedText: string;
  explanation: string;
  tips: string[];
  rating: {
    grammar: number;
    clarity: number;
    tone: number;
  };
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizData {
  questions: QuizQuestion[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
