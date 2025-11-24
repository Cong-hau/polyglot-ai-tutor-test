import React, { useState } from 'react';
import { GeminiService } from '../services/geminiService';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Loader2, ArrowRight, Book, SpellCheck, Star } from 'lucide-react';
import { WritingCorrectionResult, QuizData } from '../types';

// --- Shared Wrapper ---
const ToolWrapper: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
  <div className="space-y-6">
    <div className="border-b border-gray-200 pb-4">
      <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
    {children}
  </div>
);

// --- Grammar ---
export const GrammarTool: React.FC<{ language: string }> = ({ language }) => {
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExplain = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const text = await GeminiService.explainGrammar(language, topic);
      setResult(text);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolWrapper title="Grammar Guide" description={`Master ${language} grammar with simple explanations.`}>
      <div className="flex gap-3">
        <input
          className="flex-1 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter a topic (e.g., Past Tense, Articles...)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button 
          onClick={handleExplain} 
          disabled={loading || !topic}
          className="bg-indigo-600 text-white px-6 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : 'Explain'}
        </button>
      </div>
      {result && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-fade-in">
          <MarkdownRenderer content={result} />
        </div>
      )}
    </ToolWrapper>
  );
};

// --- Vocabulary ---
export const VocabTool: React.FC<{ language: string }> = ({ language }) => {
  const [theme, setTheme] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!theme) return;
    setLoading(true);
    try {
      const text = await GeminiService.getVocabulary(language, theme);
      setResult(text);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <ToolWrapper title="Vocabulary Builder" description={`Expand your ${language} lexicon by theme.`}>
      <div className="flex gap-3">
        <input
          className="flex-1 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter a theme (e.g., At the Airport, Business...)"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        />
        <button 
          onClick={handleGenerate}
          disabled={loading || !theme}
          className="bg-indigo-600 text-white px-6 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : 'Generate'}
        </button>
      </div>
      {result && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-fade-in">
          <MarkdownRenderer content={result} />
        </div>
      )}
    </ToolWrapper>
  );
};

// --- Writing ---
export const WritingTool: React.FC<{ language: string }> = ({ language }) => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<WritingCorrectionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCorrect = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const res = await GeminiService.correctWriting(language, text);
      setResult(res);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <ToolWrapper title="Writing Correction" description={`Get instant feedback on your ${language} writing.`}>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <textarea
            className="w-full h-64 p-4 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 resize-none"
            placeholder={`Type or paste your ${language} text here...`}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button 
            onClick={handleCorrect}
            disabled={loading || !text}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><SpellCheck className="w-5 h-5" /> Correct Text</>}
          </button>
        </div>

        <div className="space-y-4">
            {!result ? (
                <div className="h-full min-h-[200px] flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                    feedback will appear here
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in">
                    <div className="p-4 bg-green-50 border-b border-green-100">
                        <h4 className="font-semibold text-green-800 mb-2">Corrected Version</h4>
                        <p className="text-gray-800 text-lg leading-relaxed">{result.correctedText}</p>
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="flex gap-4">
                           {Object.entries(result.rating).map(([key, score]) => (
                               <div key={key} className="text-center flex-1 p-2 bg-gray-50 rounded-lg">
                                   <div className="text-xs text-gray-500 uppercase font-bold">{key}</div>
                                   <div className="font-bold text-xl text-indigo-600">{score}/10</div>
                               </div>
                           ))}
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-1">Explanation</h4>
                            <p className="text-sm text-gray-600">{result.explanation}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-1">Tips</h4>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                                {result.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </ToolWrapper>
  );
};

// --- Translation ---
export const TranslationTool: React.FC<{ language: string }> = ({ language }) => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const res = await GeminiService.translate(language, text);
      setResult(res);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <ToolWrapper title="Smart Translation" description={`Translate to ${language} with context and explanation.`}>
       <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
           <textarea
            className="w-full h-40 p-4 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 resize-none"
            placeholder="Enter text in any language..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
           <button 
            onClick={handleTranslate}
            disabled={loading || !text}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Translate & Explain'}
          </button>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[160px]">
           {result ? <MarkdownRenderer content={result} /> : <span className="text-gray-400">Translation results...</span>}
        </div>
       </div>
    </ToolWrapper>
  );
};

// --- Pronunciation ---
export const PronunciationTool: React.FC<{ language: string }> = ({ language }) => {
    const [text, setText] = useState('');
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
  
    const handleGuide = async () => {
      if (!text) return;
      setLoading(true);
      try {
        const res = await GeminiService.getPronunciationGuide(language, text);
        setResult(res);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    return (
        <ToolWrapper title="Pronunciation Guide" description="Learn how to sound like a native.">
            <div className="flex gap-3">
                <input
                className="flex-1 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                placeholder={`Enter a ${language} phrase...`}
                value={text}
                onChange={(e) => setText(e.target.value)}
                />
                <button 
                onClick={handleGuide} 
                disabled={loading || !text}
                className="bg-indigo-600 text-white px-6 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                >
                {loading ? <Loader2 className="animate-spin" /> : 'Analyze'}
                </button>
            </div>
            {result && (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-fade-in mt-6">
                <MarkdownRenderer content={result} />
                </div>
            )}
        </ToolWrapper>
    )
}

// --- Plan ---
export const PlanTool: React.FC<{ language: string }> = ({ language }) => {
    const [level, setLevel] = useState('Beginner');
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGen = async () => {
        setLoading(true);
        try {
            const res = await GeminiService.generateLearningPlan(language, level);
            setResult(res);
        } catch(e) { console.error(e); } finally { setLoading(false); }
    }

    return (
        <ToolWrapper title="Personalized Plan" description="Get a 5-day tailored learning schedule.">
             <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                 <span className="font-medium text-gray-700">My Level:</span>
                 <select 
                    value={level} 
                    onChange={e => setLevel(e.target.value)}
                    className="p-2 border rounded-md"
                >
                     <option>Beginner</option>
                     <option>Intermediate</option>
                     <option>Advanced</option>
                 </select>
                 <button 
                    onClick={handleGen}
                    disabled={loading}
                    className="ml-auto bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                 >
                     {loading ? 'Generating...' : 'Create Plan'}
                 </button>
             </div>
             {result && (
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm animate-fade-in">
                    <MarkdownRenderer content={result} />
                </div>
            )}
        </ToolWrapper>
    )
}

// --- Quiz ---
export const QuizTool: React.FC<{ language: string }> = ({ language }) => {
    const [topic, setTopic] = useState('');
    const [quiz, setQuiz] = useState<QuizData | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [showResults, setShowResults] = useState(false);

    const handleStart = async () => {
        if(!topic) return;
        setLoading(true);
        setQuiz(null);
        setSelectedAnswers({});
        setShowResults(false);
        try {
            const data = await GeminiService.generateQuiz(language, topic);
            setQuiz(data);
        } catch(e) { console.error(e) } finally { setLoading(false); }
    }

    const handleOptionSelect = (qIdx: number, oIdx: number) => {
        if (showResults) return;
        setSelectedAnswers(prev => ({...prev, [qIdx]: oIdx}));
    }

    return (
        <ToolWrapper title="Quiz Mode" description="Test your knowledge.">
            {!quiz && (
                 <div className="max-w-md mx-auto mt-8">
                     <label className="block text-sm font-medium text-gray-700 mb-2">What topic do you want to test?</label>
                    <div className="flex gap-2">
                        <input
                            className="flex-1 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g. Food vocabulary, Past tense verbs"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                         <button 
                            onClick={handleStart}
                            disabled={loading || !topic}
                            className="bg-indigo-600 text-white px-6 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Start'}
                        </button>
                    </div>
                 </div>
            )}

            {quiz && (
                <div className="space-y-8 animate-fade-in">
                    {quiz.questions.map((q, qIdx) => (
                        <div key={qIdx} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">{qIdx + 1}. {q.question}</h3>
                            <div className="space-y-2">
                                {q.options.map((opt, oIdx) => {
                                    const isSelected = selectedAnswers[qIdx] === oIdx;
                                    const isCorrect = q.correctAnswerIndex === oIdx;
                                    
                                    let btnClass = "w-full text-left p-3 rounded-lg border transition-all ";
                                    if (showResults) {
                                        if (isCorrect) btnClass += "bg-green-100 border-green-500 text-green-800 font-medium";
                                        else if (isSelected && !isCorrect) btnClass += "bg-red-100 border-red-500 text-red-800";
                                        else btnClass += "border-gray-200 opacity-60";
                                    } else {
                                        if (isSelected) btnClass += "bg-indigo-50 border-indigo-500 text-indigo-700 font-medium shadow-sm";
                                        else btnClass += "border-gray-200 hover:bg-gray-50";
                                    }

                                    return (
                                        <button 
                                            key={oIdx}
                                            onClick={() => handleOptionSelect(qIdx, oIdx)}
                                            className={btnClass}
                                        >
                                            <span className="inline-block w-6 h-6 rounded-full border text-xs leading-5 text-center mr-3 bg-white text-gray-500">
                                                {String.fromCharCode(65 + oIdx)}
                                            </span>
                                            {opt}
                                        </button>
                                    )
                                })}
                            </div>
                            {showResults && (
                                <div className={`mt-4 p-3 rounded-lg text-sm ${selectedAnswers[qIdx] === q.correctAnswerIndex ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                                    <span className="font-bold">Explanation: </span> {q.explanation}
                                </div>
                            )}
                        </div>
                    ))}
                    
                    {!showResults && (
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowResults(true)}
                                disabled={Object.keys(selectedAnswers).length < quiz.questions.length}
                                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold shadow-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Submit Answers
                            </button>
                        </div>
                    )}

                    {showResults && (
                         <div className="flex justify-center pt-6">
                            <button
                                onClick={() => setQuiz(null)} // Reset
                                className="text-indigo-600 font-medium hover:underline flex items-center gap-2"
                            >
                                Take another quiz <ArrowRight className="w-4 h-4"/>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </ToolWrapper>
    )
}
