import React, { useState } from 'react';
import { SUPPORTED_LANGUAGES, LearningGoal, Language } from './types';
import { Layout } from './components/Layout';
import { Conversation } from './components/Conversation';
import { GrammarTool, VocabTool, WritingTool, TranslationTool, PronunciationTool, PlanTool, QuizTool } from './components/Tools';
import { Globe, ArrowRight, Sparkles } from 'lucide-react';

const App = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [activeGoal, setActiveGoal] = useState<LearningGoal | null>(null);

  // --- Onboarding: Language Selection ---
  if (!selectedLanguage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full overflow-hidden">
          <div className="p-8 md:p-12 text-center">
             <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6">
                <Globe className="w-8 h-8 text-indigo-600" />
             </div>
             <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Welcome to Polyglot AI</h1>
             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
               Your personal AI tutor. Master a new language through conversation, instant feedback, and personalized lessons.
             </p>
          </div>
          
          <div className="bg-gray-50 p-8 md:p-12 border-t border-gray-100">
             <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 text-center">Select a language to begin</h2>
             <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang)}
                    className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-xl hover:border-indigo-500 hover:ring-2 hover:ring-indigo-500/20 hover:shadow-lg transition-all group"
                  >
                    <span className="text-4xl mb-3 grayscale group-hover:grayscale-0 transition-all">{lang.flag}</span>
                    <span className="font-medium text-gray-800 group-hover:text-indigo-600">{lang.name}</span>
                  </button>
                ))}
             </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Onboarding: Goal Selection ---
  if (!activeGoal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
           <button 
             onClick={() => setSelectedLanguage(null)} 
             className="text-sm text-gray-500 hover:text-gray-800 mb-6 flex items-center gap-1"
           >
             ← Back to languages
           </button>
           
           <div className="text-center mb-10">
             <h1 className="text-3xl font-bold text-gray-900 mb-3">
               What would you like to focus on in {selectedLanguage.name}?
             </h1>
             <p className="text-gray-600">You can always change this later from the dashboard.</p>
           </div>

           <div className="grid sm:grid-cols-2 gap-4">
              {Object.values(LearningGoal).map((goal) => (
                <button
                  key={goal}
                  onClick={() => setActiveGoal(goal)}
                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500 text-left transition-all flex items-center justify-between group"
                >
                  <span className="font-semibold text-gray-800 group-hover:text-indigo-600">{goal}</span>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-all" />
                </button>
              ))}
           </div>
        </div>
      </div>
    );
  }

  // --- Main Dashboard ---
  return (
    <Layout 
      activeGoal={activeGoal} 
      onGoalChange={setActiveGoal}
      selectedLanguage={selectedLanguage.name}
      onReset={() => {
        setSelectedLanguage(null);
        setActiveGoal(null);
      }}
    >
      <div className={activeGoal === LearningGoal.CONVERSATION ? 'block h-full' : 'hidden'}>
        <Conversation language={selectedLanguage.name} />
      </div>
      <div className={activeGoal === LearningGoal.GRAMMAR ? 'block' : 'hidden'}>
        <GrammarTool language={selectedLanguage.name} />
      </div>
      <div className={activeGoal === LearningGoal.VOCABULARY ? 'block' : 'hidden'}>
        <VocabTool language={selectedLanguage.name} />
      </div>
      <div className={activeGoal === LearningGoal.WRITING ? 'block' : 'hidden'}>
        <WritingTool language={selectedLanguage.name} />
      </div>
      <div className={activeGoal === LearningGoal.TRANSLATION ? 'block' : 'hidden'}>
        <TranslationTool language={selectedLanguage.name} />
      </div>
      <div className={activeGoal === LearningGoal.PRONUNCIATION ? 'block' : 'hidden'}>
        <PronunciationTool language={selectedLanguage.name} />
      </div>
      <div className={activeGoal === LearningGoal.PLAN ? 'block' : 'hidden'}>
        <PlanTool language={selectedLanguage.name} />
      </div>
      <div className={activeGoal === LearningGoal.QUIZ ? 'block' : 'hidden'}>
        <QuizTool language={selectedLanguage.name} />
      </div>
      
      {/* Decorative background element */}
      <div className="fixed bottom-0 right-0 p-8 pointer-events-none opacity-5">
         <Sparkles className="w-64 h-64 text-indigo-900" />
      </div>
    </Layout>
  );
};

export default App;