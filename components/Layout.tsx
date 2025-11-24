import React from 'react';
import { Menu, X, Globe, MessageCircle, BookOpen, PenTool, Languages, Ear, FileText, CheckCircle } from 'lucide-react';
import { LearningGoal } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeGoal: LearningGoal;
  onGoalChange: (goal: LearningGoal) => void;
  selectedLanguage: string;
  onReset: () => void;
}

const NAV_ITEMS = [
  { goal: LearningGoal.GRAMMAR, icon: BookOpen, label: 'Grammar' },
  { goal: LearningGoal.VOCABULARY, icon: Languages, label: 'Vocabulary' },
  { goal: LearningGoal.WRITING, icon: PenTool, label: 'Writing' },
  { goal: LearningGoal.TRANSLATION, icon: Globe, label: 'Translation' },
  { goal: LearningGoal.CONVERSATION, icon: MessageCircle, label: 'Conversation' },
  { goal: LearningGoal.PRONUNCIATION, icon: Ear, label: 'Pronunciation' },
  { goal: LearningGoal.QUIZ, icon: CheckCircle, label: 'Quiz' },
  { goal: LearningGoal.PLAN, icon: FileText, label: 'My Plan' },
];

export const Layout: React.FC<LayoutProps> = ({ children, activeGoal, onGoalChange, selectedLanguage, onReset }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-indigo-600 text-white p-4 flex justify-between items-center shadow-md z-20 sticky top-0">
        <h1 className="font-bold text-lg flex items-center gap-2">
          <Globe className="w-5 h-5" /> Polyglot AI
        </h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-10 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-100 hidden md:block">
            <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
              <Globe className="w-6 h-6" /> Polyglot
            </h1>
          </div>
          
          <div className="p-4 border-b border-gray-100 bg-indigo-50">
            <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-1">Learning</p>
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-800 text-lg">{selectedLanguage}</span>
              <button onClick={onReset} className="text-xs text-indigo-600 hover:underline">Change</button>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.goal}
                onClick={() => {
                  onGoalChange(item.goal);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeGoal === item.goal
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className={`w-5 h-5 ${activeGoal === item.goal ? 'text-white' : 'text-gray-400'}`} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-100">
             <div className="text-xs text-gray-400 text-center">Powered by Gemini AI</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-60px)] md:h-screen">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
           {children}
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-0 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};
