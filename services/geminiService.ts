import { GoogleGenAI, Type } from "@google/genai";
import { WritingCorrectionResult, QuizData } from "../types";

const API_KEY = process.env.API_KEY || '';

// Initialize the client once. 
// Note: We create new instances in methods if needed for fresh state, but usually one is fine 
// unless we need to re-auth (not applicable with env var).
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_FAST = 'gemini-2.5-flash';
// Using flash for everything as it's very capable for language tasks and fast/cheap.

export const GeminiService = {
  /**
   * Generates a grammar explanation.
   */
  async explainGrammar(language: string, topic: string): Promise<string> {
    const prompt = `You are an expert ${language} teacher. Explain the grammar topic "${topic}" to a student. 
    Include:
    1. A clear explanation.
    2. Examples in ${language} with translations.
    3. Common mistakes to avoid.
    Format the output in clean Markdown.`;

    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: prompt,
    });
    return response.text || "Could not generate explanation.";
  },

  /**
   * Generates a vocabulary list.
   */
  async getVocabulary(language: string, theme: string): Promise<string> {
    const prompt = `Create a vocabulary list for the theme "${theme}" in ${language}.
    Provide a table with columns: Word/Phrase, Pronunciation (if applicable), Meaning, and Example Sentence.
    Format as a Markdown table. Add a brief usage note at the end.`;

    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: prompt,
    });
    return response.text || "Could not generate vocabulary.";
  },

  /**
   * Corrects writing with structured JSON output.
   */
  async correctWriting(language: string, text: string): Promise<WritingCorrectionResult> {
    const prompt = `Act as a strict but helpful language editor for ${language}. Correct the following text:
    "${text}"
    
    Return a JSON object with:
    - correctedText: The rewritten version.
    - explanation: Why changes were made.
    - tips: A list of 3 tips for improvement.
    - rating: Object with scores (1-10) for grammar, clarity, and tone.`;

    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            correctedText: { type: Type.STRING },
            explanation: { type: Type.STRING },
            tips: { type: Type.ARRAY, items: { type: Type.STRING } },
            rating: {
              type: Type.OBJECT,
              properties: {
                grammar: { type: Type.NUMBER },
                clarity: { type: Type.NUMBER },
                tone: { type: Type.NUMBER },
              },
              required: ["grammar", "clarity", "tone"],
            },
          },
          required: ["correctedText", "explanation", "tips", "rating"],
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");
    return JSON.parse(jsonText) as WritingCorrectionResult;
  },

  /**
   * Translates text.
   */
  async translate(targetLanguage: string, text: string): Promise<string> {
    const prompt = `Translate the following text into ${targetLanguage}:
    "${text}"
    
    After the translation, provide a bulleted list explaining 2-3 key grammar points or vocabulary choices used in the translation.
    Format in Markdown.`;

    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: prompt,
    });
    return response.text || "Translation failed.";
  },

  /**
   * Generates a pronunciation guide.
   */
  async getPronunciationGuide(language: string, text: string): Promise<string> {
    const prompt = `Provide a pronunciation guide for this ${language} sentence:
    "${text}"
    
    Include:
    1. Phonetic breakdown (IPA or simple phonetic spelling).
    2. Syllable stress indication.
    3. Tone explanation (if applicable for ${language}).
    4. Notes on difficult sounds for learners.
    Format in Markdown.`;

    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: prompt,
    });
    return response.text || "Guide generation failed.";
  },

  /**
   * Generates a personalized learning plan.
   */
  async generateLearningPlan(language: string, level: string = 'Beginner'): Promise<string> {
    const prompt = `Create a 5-day mini learning plan for a ${level} student learning ${language}.
    For each day, suggest:
    - A grammar topic.
    - A vocabulary theme.
    - A quick practice exercise.
    Format in clear Markdown.`;

    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: prompt,
    });
    return response.text || "Plan generation failed.";
  },

  /**
   * Generates a quiz in JSON format.
   */
  async generateQuiz(language: string, topic: string, difficulty: string = 'Intermediate'): Promise<QuizData> {
    const prompt = `Generate a 5-question multiple choice quiz for ${language} regarding "${topic}" at a ${difficulty} level.
    Return JSON.`;

    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctAnswerIndex: { type: Type.NUMBER },
                  explanation: { type: Type.STRING },
                },
                required: ["question", "options", "correctAnswerIndex", "explanation"],
              },
            },
          },
          required: ["questions"],
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No quiz generated");
    return JSON.parse(jsonText) as QuizData;
  },

  /**
   * Initializes a chat session.
   */
  startChat(language: string, topic: string) {
    const chat = ai.chats.create({
      model: MODEL_FAST,
      config: {
        systemInstruction: `You are a friendly and patient language tutor conversation partner. 
        The language being learned is ${language}. The topic is "${topic}".
        Correct the user gently if they make major mistakes, but prioritize keeping the conversation flowing.
        Speak mostly in ${language}, but you can use English for complex explanations if the user is struggling.
        Keep responses concise (under 50 words) to encourage back-and-forth.`,
      },
    });
    return chat;
  }
};